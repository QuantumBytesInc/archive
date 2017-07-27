angular.module('App.models', [])
.service("uiCommunicateModel",['logService','uiCommunicate','$q','uiService','helperService','uiUser', UICommunicateModel])
.service("uiCommunicateSocketModel",['$q','logService','uiCommunicate','uiSocket', UICommunicateSocketModel]);


