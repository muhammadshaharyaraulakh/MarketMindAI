<?php

namespace App\App\Domain\Reports\DTOs;

class ReportSectionDTO
{
    public function __construct(
        public string $key,
        public string $title,
        public string $content
    ) {}
}
