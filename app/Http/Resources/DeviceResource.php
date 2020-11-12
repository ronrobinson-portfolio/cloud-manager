<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DeviceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'               => $this->id,
            'name'             => $this->name,
            'ip'               => $this->ip,
            'status_id'        => $this->status_id,
            'deviceble_type'   => $this->deviceable->getMorphClass(),
            'deviceable_value' => $this->getDeviceableValue()
        ];
    }

    private function getDeviceableValue() {
        $deviceable = $this->deviceable;

        return $deviceable->getMorphClass() === 'desktop'
               ? $deviceable->os->os
               : $deviceable->service->name;

    }
}
