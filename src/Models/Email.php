namespace NewsletterPlugin\Models;

use Plenty\Modules\Plugin\DataBase\Contracts\Model;

class Email extends Model
{
    public $id;
    public $title;
    public $content;
    public $isDraft;
    public $createdAt;
    public $updatedAt;
}
