<?php
namespace Domain\ContentGeneration\DTOs;

class GeneratedContentDTO
{
    public function __construct(
        public readonly string $platform,
        public readonly array  $copy,
    ) {}

    public function toArray(): array
    {
        return [
            'platform' => $this->platform,
            'copy'     => $this->copy,
        ];
    }
}
