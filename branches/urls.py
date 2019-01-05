from django.urls import path, include
from django.views.generic import TemplateView
from .views import GroupFormView, GroupTreeView, GroupView

app_name = 'branches'

urlpatterns = [
    path('creategroup/', GroupFormView.as_view()),
    path('mybranches/', TemplateView.as_view(template_name="templates/index.html")),
    path('<str:uri>/', GroupTreeView.as_view()),
    path('<str:uri>/chat/', include("branchchat.urls")),
    path('', TemplateView.as_view(template_name="templates/index.html")),
    #path('<str:uri>/', GroupView.as_view()),

]
