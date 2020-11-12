<?php

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
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
                'id'   => 1,
                'name' => 'RDS - MySQL',
            ],
            [
                'id'   => 2,
                'name' => 'RDS - Postgres',
            ],
            [
                'id'   => 3,
                'name' => 'EC2',
            ],
        ];

        collect($data)->each(function($currData) {
            Service::forceCreate($currData);
        });
    }
}
