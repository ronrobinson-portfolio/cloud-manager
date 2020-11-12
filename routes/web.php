<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('api')->group(function () {
    Route::resource('device', DeviceController::class)->only([
        'index', 'store', 'update', 'destroy'
    ]);

    Route::get('os', 'OperatingSystemController@list');
    Route::get('service', 'ServiceController@list');
    Route::get('status', 'StatusController@list');
});
