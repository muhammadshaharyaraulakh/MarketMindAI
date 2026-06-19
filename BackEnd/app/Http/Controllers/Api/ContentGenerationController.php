<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\DeleteExpiredGenerationsJob;
use Domain\ContentGeneration\Contracts\Repositories\ContentGenerationRepositoryInterface;
use Domain\ContentGeneration\Contracts\Services\ContentGenerationServiceInterface;
use Domain\ContentGeneration\Contracts\Services\ImageAnalysisServiceInterface;
use Domain\ContentGeneration\DTOs\SavedGenerationDTO;
use Domain\ContentGeneration\Requests\AnalyzeImageRequest;
use Domain\ContentGeneration\Requests\GenerateContentRequest;
use Domain\ContentGeneration\Requests\SaveToLibraryRequest;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContentGenerationController extends Controller
{
    public function __construct(
        private ImageAnalysisServiceInterface       $imageAnalysis,
        private ContentGenerationServiceInterface   $generation,
        private ContentGenerationRepositoryInterface $repository,
    ) {}

    // POST /api/content-generation/analyze-image
    // Step 2 of wizard — upload image and get AI analysis
    public function analyzeImage(
        AnalyzeImageRequest $request
    ): JsonResponse {
        try {
            $imagePath = $this->imageAnalysis->storeImage(
                $request->file('image'),
                auth()->id()
            );
            $analysis = $this->imageAnalysis->analyzeImage(
                $imagePath
            );

            return response()->json([
                'success'    => true,
                'image_path' => $imagePath,
                // returned to frontend, included in generate request
                'analysis'   => $analysis->toArray(),
            ]);

        } catch (\Exception $e) {
            \Log::error(
                'ContentGenerationController@analyzeImage: '
                . $e->getMessage()
            );
            return response()->json([
                'success' => false,
                'message' => 'Image analysis failed. Please try again.',
            ], 500);
        }
    }


    // POST /api/content-generation/generate
    // Step 5 of wizard — generate full copy package
    public function generate(
        GenerateContentRequest $request
    ): JsonResponse {
        try {
            $result = $this->generation->generateCopy($request);

            // Check if fallback was returned
            $isFallback = $result->copy['_fallback'] ?? false;

            return response()->json([
                'success'     => ! $isFallback,
                'platform'    => $result->platform,
                'copy'        => $result->copy,
                'is_fallback' => $isFallback,
                'message'     => $isFallback
                    ? ($result->copy['_message']
                        ?? 'Generation failed, please retry.')
                    : 'Copy generated successfully.',
            ]);

        } catch (\Exception $e) {
            \Log::error(
                'ContentGenerationController@generate: '
                . $e->getMessage()
            );
            return response()->json([
                'success' => false,
                'message' => 'Content generation failed. Please retry.',
            ], 500);
        }
    }

    // POST /api/content-generation/save
    // Save to Library button
    public function save(
        SaveToLibraryRequest $request
    ): JsonResponse {
        try {
            $dto = new SavedGenerationDTO(
                userId:          auth()->id(),
                imagePath:       $request->image_path,
                aiAnalysis:      $request->ai_analysis,
                platform:        $request->platform,
                questionAnswers: $request->question_answers,
                generatedCopy:   $request->generated_copy,
                expiresAt:       Carbon::now()->addHours(24),
            );

            $saved = $this->repository->save($dto);

            // Safety-net: dispatch cleanup on every save
            DeleteExpiredGenerationsJob::dispatch();

            return response()->json([
                'success' => true,
                'message' => 'Saved to library. Available for 24 hours.',
                'data'    => $saved,
            ]);

        } catch (\Exception $e) {
            \Log::error(
                'ContentGenerationController@save: '
                . $e->getMessage()
            );
            return response()->json([
                'success' => false,
                'message' => 'Failed to save. Please try again.',
            ], 500);
        }
    }

    // GET /api/content-generation/library
    // Fetch all saved generations for this user
    public function library(Request $request): JsonResponse
    {
        $items = $this->repository->findByUser(auth()->id());
        return response()->json([
            'success' => true,
            'data'    => $items,
        ]);
    }

    // DELETE /api/content-generation/library/{id}
    // Delete a saved generation
    public function destroy(
        Request $request,
        int $id
    ): JsonResponse {
        $record = $this->repository->findById($id, auth()->id());

        // Always 404 — never leak other users' records
        if (! $record) {
            return response()->json([
                'success' => false,
                'message' => 'Generation not found.',
            ], 404);
        }

        // Delete the stored image from local disk too
        if ($record->image_path) {
            $this->imageAnalysis->deleteImage($record->image_path);
        }

        $this->repository->delete($id, auth()->id());

        return response()->json([
            'success' => true,
            'message' => 'Generation deleted.',
        ]);
    }
}
