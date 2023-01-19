from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User, Profile
from .forms import UserRegisterForm


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    # form = UserUpdateForm
    add_form = UserRegisterForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('email', 'active',)
    list_filter = ('active', 'staff', 'admin',)
    search_fields = ['email']
    fieldsets = (
        ('User', {'fields': ('email', 'password')}),
        ('Permissions', {
         'fields': ('admin', 'staff', 'active', 'verified_email',)}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ("email", "password", "password2",)
        }
        ),
    )
    ordering = ('email',)
    filter_horizontal = ()


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('fullname', 'sex', 'country', 'phone',)
    search_fields = ('fullname', 'country', 'phone',)
    list_filter = ('sex',)
