import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class NotificationManager:
    def __init__(self, smtp_server="smtp.univ-annaba.dz", port=587, sender_email="noreply@univ-annaba.dz"):
        self.smtp_server = smtp_server
        self.port = port
        self.sender_email = sender_email
        # Password should be loaded from env variables
        self.password = "dummy_password"

    def send_document_ready_email(self, email: str, student_id: str, document_name: str) -> bool:
        """
        Alerts students via their official university emails when a 
        new PAdES-signed document is available.
        """
        # Validate that the email belongs to the university domain
        if not email.endswith("@univ-annaba.dz"):
            print(f"Warning: Attempting to send to non-official email {email}")

        subject = f"E-UBMA Portal: Nouveau document disponible ({document_name})"
        
        body = f"""
        Bonjour,
        
        Un nouveau document officiel ({document_name}) a été ajouté à votre coffre-fort numérique.
        Ce document a été signé électroniquement (PAdES) par l'Université Badji Mokhtar.
        
        Vous pouvez le consulter et le télécharger depuis le portail E-UBMA.
        
        Cordialement,
        L'équipe E-UBMA Portal
        """

        msg = MIMEMultipart()
        msg['From'] = self.sender_email
        msg['To'] = email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        try:
            # Simulate sending email
            print(f"Sending email to {email}...")
            # server = smtplib.SMTP(self.smtp_server, self.port)
            # server.starttls()
            # server.login(self.sender_email, self.password)
            # server.send_message(msg)
            # server.quit()
            print("Email sent successfully (simulated).")
            return True
        except Exception as e:
            print(f"Error sending email: {e}")
            return False
