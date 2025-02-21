@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

:: Définition des dossiers et fichiers
SET "BASE_DIR=%~dp0"
SET "FOLDERS=app app/dashboard app/dashboard/create app/dashboard/[id] app/dashboard/[id]/edit app/admin app/admin/dashboard app/admin/all-vms app/admin/all-vms/create app/admin/all-vms/[id] app/admin/all-vms/[id]/edit app/admin/system-images app/admin/system-images/create app/admin/system-images/[id] app/admin/system-images/[id]/edit app/admin/ssh-keys app/admin/ssh-keys/create app/admin/ssh-keys/[id] app/admin/ssh-keys/[id]/edit app/admin/users app/admin/users/create app/admin/users/[id] app/admin/users/[id]/edit app/admin/vm-history app/admin/vm-offers app/admin/vm-offers/create app/admin/vm-offers/[id] app/admin/vm-offers/[id]/edit app/virtual-machines app/virtual-machines/create app/virtual-machines/[id] app/virtual-machines/[id]/edit app/virtual-machines/[id]/ssh app/virtual-machines/[id]/start app/virtual-machines/[id]/stop app/auth app/auth/login app/auth/register app/auth/forgot-password app/auth/reset-password app/auth/reset-password/[token] app/auth/verify-email app/auth/verify-email/[id] app/auth/verify-email/[id]/[hash] app/profile components components/layouts components/auth components/dashboard components/virtual-machines components/shared lib lib/api lib/auth lib/utils types"

SET "FILES=app/page.tsx app/layout.tsx app/dashboard/page.tsx app/dashboard/create/page.tsx app/dashboard/[id]/page.tsx app/dashboard/[id]/edit/page.tsx app/admin/dashboard/page.tsx app/admin/all-vms/page.tsx app/admin/all-vms/create/page.tsx app/admin/all-vms/[id]/page.tsx app/admin/all-vms/[id]/edit/page.tsx app/admin/system-images/page.tsx app/admin/system-images/create/page.tsx app/admin/system-images/[id]/page.tsx app/admin/system-images/[id]/edit/page.tsx app/admin/ssh-keys/page.tsx app/admin/ssh-keys/create/page.tsx app/admin/ssh-keys/[id]/page.tsx app/admin/ssh-keys/[id]/edit/page.tsx app/admin/users/page.tsx app/admin/users/create/page.tsx app/admin/users/[id]/page.tsx app/admin/users/[id]/edit/page.tsx app/admin/vm-history/page.tsx app/admin/vm-offers/page.tsx app/admin/vm-offers/create/page.tsx app/admin/vm-offers/[id]/page.tsx app/admin/vm-offers/[id]/edit/page.tsx app/virtual-machines/page.tsx app/virtual-machines/create/page.tsx app/virtual-machines/[id]/page.tsx app/virtual-machines/[id]/edit/page.tsx app/virtual-machines/[id]/ssh/page.tsx app/virtual-machines/[id]/start/route.ts app/virtual-machines/[id]/stop/route.ts app/auth/login/page.tsx app/auth/register/page.tsx app/auth/forgot-password/page.tsx app/auth/reset-password/[token]/page.tsx app/auth/verify-email/[id]/[hash]/page.tsx app/profile/page.tsx components/layouts/AdminLayout.tsx components/layouts/DashboardLayout.tsx components/auth/LoginForm.tsx components/auth/RegisterForm.tsx components/auth/ForgotPasswordForm.tsx components/dashboard/DashboardStats.tsx components/virtual-machines/VMList.tsx components/virtual-machines/VMCard.tsx components/virtual-machines/VMControls.tsx components/shared/Navbar.tsx components/shared/Sidebar.tsx components/shared/Footer.tsx lib/api/axios.ts lib/auth/auth.ts lib/utils/helpers.ts types/index.ts middleware.ts"

:: Création des dossiers
echo Création des dossiers...
for %%D in (%FOLDERS%) do (
    mkdir "%BASE_DIR%\%%D" 2>nul
)

:: Création des fichiers vides
echo Création des fichiers...
for %%F in (%FILES%) do (
    echo // Fichier %%F > "%BASE_DIR%\%%F"
)

echo Projet initialisé avec succès !
ENDLOCAL
