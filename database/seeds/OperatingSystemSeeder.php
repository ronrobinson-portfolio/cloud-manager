<?php

use App\Models\OperatingSystem;
use Illuminate\Database\Seeder;

class OperatingSystemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [
                'id' => 1,
                'os' => 'Windows',
            ],
            [
                'id' => 2,
                'os' => 'Linux',
            ],
            [
                'id' => 3,
                'os' => 'Mac',
            ],
        ];

        collect($data)->each(function($currData) {
            OperatingSystem::forceCreate($currData);
        });
    }
}
