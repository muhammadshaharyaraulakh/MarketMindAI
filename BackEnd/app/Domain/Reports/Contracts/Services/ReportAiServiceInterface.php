<?php

namespace App\App\Domain\Reports\Contracts\Services;

interface ReportAiServiceInterface
{
    public function generateExecutiveSummary(array $kpiData, array $topPerformers, string $campaignName, string $platform): string;
    public function generateInsightNarrative(array $allData, string $campaignName): string;
    public function generateInsightBlock(string $topic, array $relevantData, string $campaignName): string;
    public function generatePersonas(array $adSetTargeting, array $adSetPerformance): string;
    public function generateKeyLearnings(array $allData, string $reportType): string;
    public function generateFinalRecommendations(array $allData): string;
}
