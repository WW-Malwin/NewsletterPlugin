namespace NewsletterPlugin\Providers;

use Plenty\Plugin\RouteServiceProvider;
use Plenty\Plugin\Routing\Router;

class NewsletterPluginRouteServiceProvider extends RouteServiceProvider
{
    public function map(Router $router)
    {
        $router->get('newsletter', 'NewsletterPlugin\Controllers\NewsletterController@index');
        $router->get('newsletter/builder', 'NewsletterPlugin\Controllers\NewsletterBuilderController@index');
        $router->post('newsletter/save', 'NewsletterPlugin\Controllers\EmailController@saveEmail');
        $router->get('newsletter/load/{id}', 'NewsletterPlugin\Controllers\EmailController@loadEmail');
        $router->get('newsletter/list', 'NewsletterPlugin\Controllers\EmailController@listEmails');
        $router->delete('newsletter/delete/{id}', 'NewsletterPlugin\Controllers\EmailController@deleteEmail');
    }
}
