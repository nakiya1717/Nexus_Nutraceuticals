from django.contrib import admin
from .models import Policy, PolicySection, PolicyContentItem, PolicyContact, PolicyVersion, PolicyAuditLog

class PolicyContentItemInline(admin.StackedInline):
    model = PolicyContentItem
    extra = 1

class PolicySectionInline(admin.StackedInline):
    model = PolicySection
    extra = 1

@admin.register(PolicyContact)
class PolicyContactAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'support_email', 'is_active', 'updated_at')
    list_filter = ('is_active',)

@admin.register(Policy)
class PolicyAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'status', 'published_at', 'last_updated_at')
    list_filter = ('status',)
    search_fields = ('title', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [PolicySectionInline]

@admin.register(PolicySection)
class PolicySectionAdmin(admin.ModelAdmin):
    list_display = ('title', 'policy', 'display_order', 'is_active')
    list_filter = ('policy', 'is_active')
    search_fields = ('title', 'policy__title')
    inlines = [PolicyContentItemInline]

@admin.register(PolicyContentItem)
class PolicyContentItemAdmin(admin.ModelAdmin):
    list_display = ('item_type', 'title', 'policy_section', 'display_order', 'is_active')
    list_filter = ('item_type', 'is_active', 'policy_section__policy')

@admin.register(PolicyVersion)
class PolicyVersionAdmin(admin.ModelAdmin):
    list_display = ('policy', 'version_number', 'changed_by', 'created_at')
    readonly_fields = ('policy', 'version_number', 'policy_snapshot', 'changed_by', 'change_summary', 'created_at')

@admin.register(PolicyAuditLog)
class PolicyAuditLogAdmin(admin.ModelAdmin):
    list_display = ('action', 'policy', 'user', 'created_at')
    readonly_fields = ('policy', 'user', 'action', 'previous_data', 'new_data', 'created_at')
