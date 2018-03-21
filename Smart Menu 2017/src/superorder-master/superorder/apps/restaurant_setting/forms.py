from django import forms

from superorder.apps.authentication.models import Restaurant
from .models import *

class ChangeUrlForm(forms.ModelForm):
    class Meta:
        model = Restaurant
        fields = ('url',)

    # extend is_valid: add case insensitive check
    def is_valid(self):
        valid = super(ChangeUrlForm, self).is_valid()
        if not valid:
            return valid
        # case insensitive Match
        if Restaurant.objects.filter(url__iexact=self.cleaned_data['url']).exists():
            self._errors['url'] = ['Restaurant with this Url already exists.']
            return False
        return True

class UploadImageForm(forms.ModelForm):
    class Meta:
        model = Restaurant
        fields = ('logo',)

class FoodForm(forms.ModelForm):
    class Meta:
        model = Food
        exclude = ('src', 'restaurant')


class OrderForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ('peopleNum', 'tableNum')
