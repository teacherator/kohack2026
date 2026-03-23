import os
import smtplib
from icalendar import Calendar, Event, vCalAddress, vText
from datetime import datetime
import pytz
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

def send_update(time_studied, mishnah_portion):
    sender_email = "avilubick@gmail.com"
    smtp_password = "" #add password here
    receiver_email = "guackingofamerica@gmail.com"
    start = datetime(2026, 4, 15, 10, 0, 0, tzinfo=pytz.UTC)
    end = datetime(2026, 4, 15, 11, 0, 0, tzinfo=pytz.UTC)
    now = datetime.now(pytz.UTC)

    cal = Calendar()
    cal.add("prodid", "-//Avi Calendar Invite//mxm.dk//")
    cal.add("version", "2.0")
    cal.add("method", "REQUEST")

    event = Event()
    event.add("uid", "project-sync-20260415-1000@avilubick")
    event.add("summary", "Daily Update")
    event.add("description", f"Update on your daily mishnah study: {time_studied} hours, {mishnah_portion} studied.")
    event.add("location", "Daily Mishnah Study Room")
    event.add("dtstart", start)
    event.add("dtend", end)
    event.add("dtstamp", now)
    event.add("status", "CONFIRMED")
    event.add("sequence", 0)

    organizer = vCalAddress(f"MAILTO:{sender_email}")
    organizer.params["cn"] = vText("Avi Lubick")
    organizer.params["role"] = vText("CHAIR")
    event["organizer"] = organizer

    attendee = vCalAddress(f"MAILTO:{receiver_email}")
    attendee.params["cn"] = vText(receiver_email)
    attendee.params["role"] = vText("REQ-PARTICIPANT")
    attendee.params["partstat"] = vText("NEEDS-ACTION")
    attendee.params["rsvp"] = vText("TRUE")
    event.add("attendee", attendee, encode=0)

    cal.add_component(event)
    ical_bytes = cal.to_ical()
    ical_text = ical_bytes.decode("utf-8")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Invitation: Project Sync Meeting"
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg["Content-Class"] = "urn:content-classes:calendarmessage"

    body = MIMEText("Please see the meeting invitation.", "plain")
    calendar_part = MIMEText(ical_text, "calendar;method=REQUEST")

    msg.attach(body)
    msg.attach(calendar_part)

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(sender_email, smtp_password)
        server.sendmail(sender_email, receiver_email, msg.as_string())