namespace NewsletterPlugin\Migrations;

use Plenty\Modules\Helper\Models\KeyValue;
use Plenty\Modules\Plugin\DataBase\Contracts\Migrate;

class CreateEmailsTable
{
    public function run(Migrate $migrate)
    {
        $migrate->createTable('NewsletterEmails', function($table) {
            $table->increments('id');
            $table->string('title');
            $table->text('content');
            $table->boolean('isDraft')->default(false);
            $table->timestamps();
        });
    }
}
