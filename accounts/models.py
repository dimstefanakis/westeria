from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver
import uuid
import random
import string


def uid_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

class User(AbstractUser):

    class Meta:
        swappable = 'AUTH_USER_MODEL'
        db_table = 'auth_user'

    username = models.CharField(blank=True, null=True, unique=False, max_length=24)
    email = models.EmailField(unique=True)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    def __str__(self):
        return '%s' % self.email


class UserProfile(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='profile',
    )
    url = models.CharField(unique=True, null=False, max_length=60)
    name = models.CharField(blank=False, null=False, default="Anon", max_length=24)
    profile_image = models.ImageField(upload_to='images/users/profile',
                                      default='/images/users/profile/default.jpeg',
                                      blank=False)
    fake_count = models.IntegerField(default=0)

    REQUIRED_FIELDS = ['name']
    def __str__(self):
        return '%s' % self.name


'''@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
        instance.profile.url = instance.id
        instance.profile.save()'''


'''@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()'''


class FakeProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)

    def save(self, *args, **kwargs):
        user = User.objects.get(id=self.user)
        user.fake_count += 1
        user.save()
        super(FakeProfile, self).save(*args, **kwargs)

    def __str__(self):
        return '%s' % self.user_id