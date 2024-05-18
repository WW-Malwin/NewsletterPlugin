namespace NewsletterPlugin\Controllers;

use Plenty\Plugin\Controller;
use Plenty\Plugin\Templates\Twig;

class NewsletterBuilderController extends Controller
{
    public function index(Twig $twig):string
    {
        return $twig->render('NewsletterPlugin::content.builder');
    }
}
