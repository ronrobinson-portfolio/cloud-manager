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
    Route::get('test', 'DeviceController@test');

    Route::prefix('alexa')->group(function () {
        Route::get('summary', 'AlexaController@summary');
        Route::get('list_devices', 'AlexaController@listDevices');
        Route::get('show_emulator', 'AlexaController@showEmulator');
        Route::get('turn_off/{device}', 'AlexaController@turnOff');
        Route::get('turn_on/{device}', 'AlexaController@turnOn');
    });
});
