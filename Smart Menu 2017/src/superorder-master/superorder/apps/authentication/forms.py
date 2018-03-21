from django import forms
from .models import Restaurant

class RegisterForm(forms.ModelForm):
    class Meta:
        model = Restaurant
        exclude = ['applicant', 'url', 'logo', 'employee']
