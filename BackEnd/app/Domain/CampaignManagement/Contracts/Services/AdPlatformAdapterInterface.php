<?php

namespace App\Domain\CampaignManagement\Contracts\Services;

interface AdPlatformAdapterInterface
{
    /**
     * Push a campaign creation request to the external ad platform.
     * 
     * @param array $campaignData
     * @param \App\Models\AdAccount $adAccount
     * @return array Returns an array containing 'success' (bool) and 'external_id' (string|null).
     */
    public function createCampaign(array $campaignData, \App\Models\AdAccount $adAccount): array;
}
