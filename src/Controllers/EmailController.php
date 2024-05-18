namespace NewsletterPlugin\Controllers;

use Plenty\Plugin\Controller;
use Plenty\Plugin\Http\Request;
use NewsletterPlugin\Models\Email;
use Exception;

class EmailController extends Controller
{
    public function saveEmail(Request $request)
    {
        $data = $request->all();

        if (empty($data['title']) || empty($data['content'])) {
            return response()->json(['success' => false, 'message' => 'Titel und Inhalt sind erforderlich.'], 400);
        }

        try {
            $email = new Email();
            $email->title = $data['title'];
            $email->content = $data['content'];
            $email->isDraft = $data['draft'] ?? false;
            $email->save();

            return response()->json(['success' => true, 'id' => $email->id]);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Fehler beim Speichern der E-Mail.'], 500);
        }
    }

    public function loadEmail($id)
    {
        try {
            $email = Email::findOrFail($id);
            return response()->json(['success' => true, 'content' => $email->content]);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Fehler beim Laden der E-Mail.'], 500);
        }
    }

    public function listEmails()
    {
        try {
            $emails = Email::all();
            return response()->json($emails);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Fehler beim Laden der E-Mail-Liste.'], 500);
        }
    }

    public function deleteEmail($id)
    {
        try {
            $email = Email::findOrFail($id);
            $email->delete();
            return response()->json(['success' => true]);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Fehler beim Löschen der E-Mail.'], 500);
        }
    }
}
