<?php

namespace Database\Seeders;

use App\Models\Roles;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'admin',
                'description' => 'Administrator with full access'
            ],
            [
                'name' => 'mentor',
                'description' => 'Mentor user'
            ],
            [
                'name' => 'mentee',
                'description' => 'Mentee user'
            ],
        ];
        foreach ($roles as $role) {
            Roles::firstOrCreate(
                ['name' => $role['name']],
                ['description' => $role['description']]
            );        }
    }
}
