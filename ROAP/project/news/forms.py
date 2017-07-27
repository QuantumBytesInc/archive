# Copyright (C) 2016 QuantumBytes inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django includes
from django import forms


class CommentForm(forms.Form):
    """Form for user comments
    """
    text = forms.CharField(widget=forms.Textarea(attrs={'class': 'inputFieldComment'}))     #: Comment ext
    
    def clean_text(self):
        """Validate if comment is valid
        """
        # Get cleaned data
        data = self.cleaned_data['text']    #: Cleaned data

        # Check for content
        if len(data.replace(' ', '')) < 5:
            raise forms.ValidationError("Comment is to short! (Five letters at least)")

        # Always return data!
        return data
