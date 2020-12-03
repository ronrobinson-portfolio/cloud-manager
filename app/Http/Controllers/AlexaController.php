<?php

namespace App\Http\Controllers;


use App\Models\Status;
use App\Models\Device;
use App\Events\ListDevicesEvent;
use App\Events\ShowEmulatorEvent;
use App\Events\DeviceUpdatedEvent;
use App\Http\Resources\ResponseResource;
use App\Http\Resources\AlexaDeviceResource;
use Illuminate\Support\Facades\Http;

class AlexaController extends Controller
{
    public function summary() {
        $statuses = Status::withCount('devices')->get();

        $deviceCount =  $statuses->reduce(function($acc, $item){
            $acc[strtolower($item->status)] =  $item->devices_count;
            return $acc;
        }, []);

        return new AlexaDeviceResource((object)$deviceCount);
    }

    public function listDevices() {
        event(new ListDevicesEvent());
        return new ResponseResource(['message' => 'Devices Listed']);
    }

    public function showEmulator() {
        event(new ShowEmulatorEvent());
        return new ResponseResource(['message' => 'Showing Emulator']);
    }

    public function turnOff(Device $device) {
        if ($device->status_id != 2) {
            $device->status_id = 2;
            $device->save();

            if ($device->deviceable_type == 'aws_service') {
                Http::get('https://api.notifymyecho.com/v1/NotifyMe', [
                    'notification' => 'Device ' . $device->id . ' was turned off. The device name is ' . $device->name . ' and type ' . $device->deviceable_type,
                    'accessCode'   => env('NOTIFYME'),
                ]);
            }

            event(new DeviceUpdatedEvent($device));
            return new ResponseResource(['message' => 'Device ' . $device->id . ' was turned off']);
        }

        return new ResponseResource(['message' => 'Device is already off']);
    }

    public function turnOn(Device $device) {
        if ($device->status_id != 1) {
            $device->status_id = 1;
            $device->save();

            event(new DeviceUpdatedEvent($device));
            return new ResponseResource(['message' => 'Device ' . $device->id . ' was turned on']);
        }

        return new ResponseResource(['message' => 'Device is already on']);
    }
}
