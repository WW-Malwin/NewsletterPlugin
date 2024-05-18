namespace NewsletterPlugin\Providers;

use Plenty\Plugin\ServiceProvider;

class NewsletterPluginServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->getApplication()->register(NewsletterPluginRouteServiceProvider::class);
    }
}
