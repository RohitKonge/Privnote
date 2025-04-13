import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Lock, Info, X, HelpCircle } from 'lucide-react';
import CreateNote from './components/CreateNote';
import ViewNote from './components/ViewNote';
import NoteDestroyed from './components/NoteDestroyed';

// Route title updater component
function RouteTitle() {
  const location = useLocation();
  
  useEffect(() => {
    const baseTitle = "Privnote - Private Notes that Self-Destruct";
    let pageTitle = baseTitle;
    
    if (location.pathname.includes('/note/')) {
      pageTitle = "View Private Note | " + baseTitle;
    } else if (location.pathname === '/destroyed') {
      pageTitle = "Note Destroyed | " + baseTitle;
    } else {
      pageTitle = "Create Note | " + baseTitle;
    }
    
    document.title = pageTitle;
  }, [location]);
  
  return null;
}

function App() {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 text-gray-900 flex flex-col">
        <RouteTitle />
        <header className="py-6 px-4 border-b border-gray-200">
          <div className="max-w-4xl mx-auto flex items-center justify-between w-full">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Lock className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold">Privnote</h1>
            </Link>
            <button 
              onClick={() => setShowInfoModal(true)}
              className="flex items-center justify-center w-8 h-8 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
              aria-label="Information about Privnote"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </header>
        
        <main className="w-full px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Routes>
              <Route path="/" element={<CreateNote />} />
              <Route path="/note/:id" element={<ViewNote />} />
              <Route path="/destroyed" element={<NoteDestroyed />} />
            </Routes>
          </div>
        </main>

        <footer className="w-full px-4 py-6 mt-auto border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4">
              <p className="text-gray-500 text-sm">© Privnote 2015 - 2025</p>
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Privacy
                </button>
                <button 
                  onClick={() => setShowFaqModal(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  FAQ
                </button>
                <button 
                  onClick={() => setShowAboutModal(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  About
                </button>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-4 text-center">Send private, self-destructing notes with confidence.</p>
          </div>
        </footer>

        {/* Information Modal */}
        {showInfoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
              <button 
                onClick={() => setShowInfoModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                aria-label="Close information modal"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">How Privnote Works</h2>
              </div>
              
              <p className="mb-4 text-gray-700">
                With Privnote you can send notes that will self-destruct after being read.
              </p>
              
              <ol className="list-decimal pl-5 text-gray-700 space-y-2 mb-4">
                <li>Write the note below, encrypt it and get a link.</li>
                <li>Send the link to whom you want to read the note.</li>
                <li>The note will self-destruct after being read by the recipient.</li>
              </ol>
            </div>
          </div>
        )}

        {/* FAQ Modal */}
        {showFaqModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setShowFaqModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                aria-label="Close FAQ modal"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Is Privnote really private?</h3>
                  <p className="mt-2 text-gray-700">
                    We are confident in asserting that Privnote is both private and secure, and we are committed to making sure it remains that way. 
                    Please read our <button onClick={() => {setShowFaqModal(false); setShowPrivacyModal(true);}} className="text-blue-600 hover:underline">Privacy Policy</button> for further details.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">How can I send my note? Is there a way to send the link directly from Privnote's site?</h3>
                  <p className="mt-2 text-gray-700">
                    Privnote gives you a link to your note. You have to copy and paste that link into an email (or instant message) 
                    and send it to the person you want to read the note.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Can I send a Privnote to multiple recipients?</h3>
                  <p className="mt-2 text-gray-700">
                    If you want to send the same note to more than one person, go to "Show options" and opt for a time interval for the note's removal, 
                    then independently of how many times the note is retrieved, the note will be deleted only after that specified time is completed.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">What can I do if I regret sending the note or if I mistakenly send it to someone I do not want to read it?</h3>
                  <p className="mt-2 text-gray-700">
                    You just have to paste the link into your browser's URL, and when the note is displayed it will self-destruct. 
                    When the person you sent the link to attempts to do the same, a message will display saying that the note has already been read.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Can I know when the note is read?</h3>
                  <p className="mt-2 text-gray-700">
                    Yes, you have to check the notification box below the note and enter your email address. Privnote will send 
                    an email to that address when the note is read. You can also add a reference to identify each note.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">The recipient can copy and paste the note, so it doesn't actually self-destruct, right?</h3>
                  <p className="mt-2 text-gray-700">
                    Right. But, then again, you couldn't prevent the recipient from taking a screen capture or even memorizing the note. 
                    That's why Privnote doesn't try to protect the note contents from being copied. It only makes sure that the contents 
                    is never read, by anyone, before it reaches the recipient, and is never read by anyone afterward either. 
                    What the recipient does with the note is his sole responsability.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Is it possible to see a recently read note using the history of the browser, the back button or the recently closed tabs feature?</h3>
                  <p className="mt-2 text-gray-700">
                    The note self-destructs after being read; there is no way to re-read it once it has been read.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">How much time are unread notes stored on your servers?</h3>
                  <p className="mt-2 text-gray-700">
                    After 30 days all unread notes are automatically deleted. For more information, you can read our <button onClick={() => {setShowFaqModal(false); setShowPrivacyModal(true);}} className="text-blue-600 hover:underline">Privacy Policy</button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Policy Modal */}
        {showPrivacyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                aria-label="Close privacy policy modal"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
              <p className="text-gray-500 text-sm mb-6">Last modified: May 25th, 2018</p>
              
              <div className="prose prose-blue max-w-none text-gray-700">
                <p>
                  At Privnote, privacy is taken very seriously, since the main purpose of the site is to preserve it. 
                  This policy outlines the measures taken by Privnote to protect the privacy of its users.
                </p>
                
                <h3 className="font-semibold text-lg mt-6 mb-3">1. Service description</h3>
                <p>
                  Privnote is a free web based service that allows users to create encrypted notes that they can share over 
                  the internet as unique one-time-use HTTPS URLs (hereafter referred to as links) which by default expire 
                  after its first access via any web browser.
                </p>
                <p>
                  As Privnote does not provide any means for transmitting the link, the act of sending the link is the full 
                  responsibility of Privnote users.
                </p>
                <p>
                  Depending on the communication channel of your choice (e.g., e-mail, fax, SMS, phone, instant messaging, 
                  social media), there may be a certain risk that third parties intercept your communication, get knowledge 
                  of the communicated link and thus may be able to read your note.
                </p>
                
                <h3 className="font-semibold text-lg mt-6 mb-3">2. How the notes and its contents are processed</h3>
                <p>
                  The link is generated in the user's browser and at no time is sent as such to Privnote. The link is thus 
                  in the sender's (and later possibly in the recipient's) hands only. Therefore, there is no way to recover 
                  a note if a Privnote user losses the link.
                </p>
                <p>
                  Since only the link binds the decryption key to the note's content and since Privnote does not have the link, 
                  at no time is any note held in any readable format state at Privnote. This assures that nobody (including 
                  Privnote's administrators) can read a note.
                </p>
                <p>
                  When using Privnote's default funtionality, when a note is retrieved, its data is completely removed from 
                  Privnote; there is absolutely no way to recover it again.
                </p>
                <p>
                  When "Show options" is selected and the user opts for a time interval for the note's removal, then independently 
                  of how many times the note is retrieved, the note will be deleted only after that specified time is completed.
                </p>
                <p>
                  After a note is deleted from Privnote, there is absolutely no way to recover it again.
                </p>
                <p>
                  When a note is not retrieved after 30 days, Privnote removes it permanently, just as if it were read.The Privnote 
                  sysadmin team will do as much as possible to protect the site against unauthorized access, modification or 
                  destruction of the data. But, even if someone or something could manage to gain access to the database, they 
                  would be unable to read the notes since their contents are encrypted and can't be decrypted without the links 
                  which Privnote never has a hold of.
                </p>
                
                <h3 className="font-semibold text-lg mt-6 mb-3">3. Processing of IP addresses</h3>
                <p>
                  Privnote is not logging the IP addresses; they are processed to enable communication with Privnote's servers 
                  but they are not part of the log-files. IP addresses are deleted as soon as they are no longer needed for the 
                  purpose of communication.
                </p>
                
                <h3 className="font-semibold text-lg mt-6 mb-3">4. Pseudonymous data</h3>
                <p>
                  The creator of the note can introduce personal data into the note. Even though this data is encrypted, the 
                  data can be decrypted again and thus constitutes pseudonymous (personal) data. In any case, one cannot deduce 
                  the note's creator from Privnote's database, as Privnote does not store IP addresses.
                </p>
                <p>
                  The decryption of the note's data is in the users' hands (sender and recipient). Privnote is not able to decrypt 
                  the note and access the data (personal or otherwise) introduced by the creator since Privnote is never in 
                  possession of the decryption key which is contained only in the link.
                </p>
                
                <h3 className="font-semibold text-lg mt-6 mb-3">5. Disclaimer</h3>
                <p>
                  When a person clicks the Privnote's link, Privnote declines any responsibility related to the note's content.
                </p>
                
                <h3 className="font-semibold text-lg mt-6 mb-3">6. Disclosure of Data to Third Party</h3>
                <p>
                  Privnote does not share nor sell any information to others, nor use it in any way not mentioned in this 
                  Privacy Policy.
                </p>
                
                <h3 className="font-semibold text-lg mt-6 mb-3">7. Use of cookies</h3>
                <p>
                  Privnote uses cookies (small text files that are stored on your computer by your browser when you visit a 
                  website) for our own interest in improving the use of our site and service. In some cases they will also be 
                  used for promotional purposes. The type of cookies Privnote uses are listed below:
                </p>
                <p className="font-semibold mt-3">Functional cookies</p>
                <p>
                  Privnote uses persistent cookies to keep a session in the user's preferred language and to record your 
                  notification that Privnote uses cookies as explained in this section. Also some cookies are used as part of 
                  the link hiding mechanism when reading a note, these cookies in particular must be enabled for Privnote to 
                  function and are deleted immediately after the note is retrieved.
                </p>
                <p className="font-semibold mt-3">Non-functional cookies</p>
                <p>
                  Used for commercial and promotional purposes. Non-functional cookies are placed by third parties. In case of 
                  European citizens, these cookies do not store personal data (non-personalized ads).
                  If you would want to remove certain cookies, or block them from being stored in your browser, it is possible 
                  via your browser settings for cookies. However, if you do this, the site might not work as expected.
                </p>
                
                <h3 className="font-semibold text-lg mt-6 mb-3">8. Children</h3>
                <p>
                  Privnote does not target and is not intended to attract children under the age of 16. Minors must obtain 
                  express consent from their parents or legal guardians prior to accessing or using Privnote.
                </p>
                
                <h3 className="font-semibold text-lg mt-6 mb-3">9. Validity of this Privacy Policy</h3>
                <p>
                  Please note that this Privacy Policy may change from time to time. We expect most changes to be minor. 
                  Regardless, we will post any Policy changes on this page, and if the changes are significant, we will provide 
                  a more prominent notice such as a message on the home page. Each version of this Policy will be identified at 
                  the top of the page by its effective date.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* About Modal */}
        {showAboutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setShowAboutModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                aria-label="Close about modal"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-semibold mb-6">About Privnote</h2>
              
              <div className="prose prose-blue max-w-none text-gray-700">
                <p>
                  Have you ever wanted to send confidential information within your work environment, to family or friends, 
                  but were afraid to do so over the internet, because some malicious hacker could be spying on you?
                </p>
                
                <p className="my-4">
                  Privnote is a free web based service that allows you to send top secret notes over the internet. 
                  It's fast, easy, and requires no password or user registration at all.
                </p>
                
                <p>
                  Just write your note, and you'll get a link. Then you copy and paste that link into an email (or instant message) 
                  that you send to the person who you want to read the note. When that person clicks the link for the first time, 
                  they will see the note in their browser and the note will automatically self-destruct; which means no one 
                  (even that very same person) can read the note again. The link won't work anymore.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;