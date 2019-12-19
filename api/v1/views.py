from rest_framework import viewsets, views, mixins,generics,filters,permissions
from django.core.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser,JSONParser,FileUploadParser
from api import serializers as serializers_v0
from api import permissions as api_permissions
from . import serializers
from branches.models import Branch
from branchchat.models import ChatRequest
from feedback.models import Feedback


class OwnedBranchesViewSet(mixins.RetrieveModelMixin,
                         mixins.ListModelMixin,
                         viewsets.GenericViewSet):
    serializer_class = serializers_v0.BranchSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = user.owned_groups.all()
        return queryset


class FollowingBranchesViewSet(viewsets.GenericViewSet,
                        mixins.ListModelMixin,):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,api_permissions.IsOwnerOfBranch)
    serializer_class = serializers_v0.BranchSerializer

    def get_queryset(self):
        branch = Branch.objects.get(uri__iexact=(self.kwargs['branch__uri'] if 'branch__uri' in self.kwargs else
                                                 self.kwargs['branch_uri']))
        return branch.follows.all()


class MutualFollowsViewSet(viewsets.GenericViewSet,
                        mixins.ListModelMixin,):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,api_permissions.IsOwnerOfBranch)
    serializer_class = serializers_v0.BranchSerializer

    def get_queryset(self):
        branch = Branch.objects.get(uri__iexact=(self.kwargs['branch__uri'] if 'branch__uri' in self.kwargs else
                                                 self.kwargs['branch_uri']))
        return branch.follows.filter(follows__in=branch.followed_by.all()).exclude(pk=branch.pk).distinct()


class CreateConversationViewSet(viewsets.GenericViewSet,
                                mixins.CreateModelMixin):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, api_permissions.IsOwnerOfBranch)
    serializer_class = serializers.NewChatRoomSerializer
    parser_classes = (MultiPartParser, JSONParser, FileUploadParser,)

    def create(self, request, *args, **kwargs):
        owner = Branch.objects.get(uri__iexact=(self.kwargs['branch__uri'] if 'branch__uri' in self.kwargs else
                                                self.kwargs['branch_uri']))
        serializer = self.serializer_class(data=request.data,
                                           context={'owner': owner})
        if serializer.is_valid():
            serializer.save(owner=owner)
            return Response(serializer.data)
        else:
            return Response(serializer.errors)


class ConversationInvitationsViewSet(viewsets.GenericViewSet,
                                mixins.UpdateModelMixin,
                                mixins.RetrieveModelMixin,
                                mixins.ListModelMixin):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, api_permissions.IsOwnerOfBranch)
    serializer_class = serializers_v0.ChatRequestWithRoomSerializer

    def get_queryset(self):
        branch = Branch.objects.get(uri__iexact=(self.kwargs['branch__uri'] if 'branch__uri' in self.kwargs else
                                                 self.kwargs['branch_uri']))
        return ChatRequest.objects.filter(request_to=branch)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        if serializer.is_valid():
            if instance.status != ChatRequest.STATUS_ON_HOLD:
                serializer.save(status=instance.status)
            else:
                serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)


class FeedbackViewSet(viewsets.GenericViewSet,
                      mixins.CreateModelMixin):
    permission_classes = (permissions.AllowAny,)

    def get_serializer_class(self):
        if self.request.user.is_authenticated:
            return serializers.FeedbackWithUserSerializer
        return serializers.FeedbackSerializer

    def create(self, request, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data)
        else:
            return Response(serializer.errors)

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()


class GetPathsViewSet(viewsets.GenericViewSet,
                      mixins.ListModelMixin):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = serializers.BranchPathSerializer

    def get_queryset(self):
        return Branch.objects.filter(uri__iexact=self.request.GET['to'])


class GetNodesBeneathViewSet(viewsets.GenericViewSet,
                             mixins.ListModelMixin):
    lookup_field = 'branch'
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = serializers.BranchNodesBeneathSerializer

    def get_queryset(self):
        return Branch.objects.filter(uri__iexact=self.kwargs['branch'])


class TopLevelBranchesViewSet(viewsets.GenericViewSet,
                              mixins.ListModelMixin):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = serializers_v0.BranchSerializer

    def get_queryset(self):
        try:
            return Branch.objects.filter(uri__iexact='root').first().children.all()
        except Exception:
            return Branch.objects.none()
