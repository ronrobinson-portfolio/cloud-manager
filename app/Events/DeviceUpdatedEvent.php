<?php

namespace App\Events;

use App\Models\Device;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class DeviceUpdatedEvent implements ShouldBroadcast
{
    //use Dispatchable, InteractsWithSockets, SerializesModels;

    public $device;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Device $device)
    {
        $this->device = $device;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('device-updated');
    }
}
