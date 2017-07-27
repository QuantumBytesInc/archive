# Copyright (C) 2016 Quantum Bytes Inc. All rights reserved.
#
# version   1.0
# author    Manuel Gysin <manuel.gysin@quantum-bytes.com>

# Django includes
from django.utils.translation import ugettext as _


activation_text_header = _('Relics of Annorath - Account activation')
activation_text_body = _('''Hello %s \n\n
                            Thank you for your registration for the Relics of Annorath Alpha!\n\n
                            Please activate your account through the following link:\n
                            %s/activate/%s\n\n
                            Checkout %s/getting-started for getting started!''')

reactivation_text_header = _('Relics of Annorath - Account reactivation')
reactivation_text_body = _('''Hello %s \n\n
                              You have successfully changed your e-mail address!\n\n
                              Please reactivate your account with following link:\n
                              %s/activate/%s\n\n
                              Checkout %s/getting-started for getting started!''')

recovery_text_header = _('Relics of Annorath - Account recovery')
recovery_text_body = _('''Hello %s \n\n
                          You have requested an account recovery!\n\n
                          Please recover your account through following link:\n
                          %s/recover/%s\n\n
                          Checkout %s/getting-started for getting started!''')

recovery_done_text_header = _('Relics of Annorath - Account recovery')
recovery_done_text_body = _('''Hello %s \n\n
                               Your account password was successfully been changed!\n\n
                               Checkout %s/getting-started for getting started!''')
