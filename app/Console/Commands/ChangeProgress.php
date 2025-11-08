<?php

namespace App\Console\Commands;

use App\Events\ChangeProgressValue;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Broadcast;

class ChangeProgress extends Command
{
    protected $signature = 'change:progress {--progress=}';
    protected $description = 'Update progress value';

    public function handle()
    {
        $progress = $this->option("progress");

        Broadcast::event(new ChangeProgressValue($progress , 3)); // Use ::event()

        $this->info("Progress updated to: {$progress}");
    }
}
