<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->configureModels();
        $this->configureRateLimiters();
    }

    private function configureModels(): void
    {
        Model::shouldBeStrict(! $this->app->isProduction());
    }

    private function configureRateLimiters(): void
    {
        RateLimiter::for('login', function (Request $request) {
            $parts = explode(',', (string) config('throttle.login', '5,1'));

            return Limit::perMinutes((int) $parts[1], (int) $parts[0])
                ->by($request->ip());
        });

        RateLimiter::for('register', function (Request $request) {
            $parts = explode(',', (string) config('throttle.register', '3,1'));

            return Limit::perMinutes((int) $parts[1], (int) $parts[0])
                ->by($request->ip());
        });

        RateLimiter::for('api', function (Request $request) {
            $parts = explode(',', (string) config('throttle.api', '60,1'));

            return Limit::perMinutes((int) $parts[1], (int) $parts[0])
                ->by($request->user()?->id ?: $request->ip());
        });
    }
}