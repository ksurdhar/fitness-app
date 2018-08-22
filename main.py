import webapp2
import urllib2
class NotificationsCronPage(webapp2.RequestHandler):
    def get(self):
        request = urllib2.Request('https://us-central1-wizard-fitness.cloudfunctions.net/notification-job', headers={"cronrequest" : "true"})
        contents = urllib2.urlopen(request).read()
app = webapp2.WSGIApplication([
    ('/notifications', NotificationsCronPage),
    ], debug=True)
