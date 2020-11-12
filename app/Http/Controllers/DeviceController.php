<?php

namespace App\Http\Controllers;

use App\Models\AwsService;
use App\Models\Device;
use App\Models\Desktop;
use App\Http\Resources\DeviceResource;
use App\Http\Resources\ResponseResource;
use App\Http\Requests\DeviceFormRequest;

class DeviceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return DeviceResource::collection(Device::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(DeviceFormRequest $request)
    {
        $device = new Device([
            'name'      => $request->name,
            'ip'        => $request->ip,
            'status_id' => $request->status_id,
        ]);

        $deviceable = $request->device_type === 'Computer'
                      ? Desktop::create(['os_id' => $request->os])
                      : AwsService::create(['service_id' => $request->service]);

        $device->deviceable()->associate($deviceable)->save();

        return new ResponseResource(['message' => 'Device Created']);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Device  $device
     * @return \Illuminate\Http\Response
     */
    public function update(DeviceFormRequest $request, Device $device)
    {
        $device->name      = $request->name;
        $device->ip        = $request->ip;
        $device->status_id = $request->status_id;
        $device->save();

        return new ResponseResource(['message' => 'Device Saved']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Device  $device
     * @return \Illuminate\Http\Response
     */
    public function destroy(Device $device)
    {
        //
    }
}
