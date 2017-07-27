mkdir -p ~/rpmbuild/{RPMS,SRPMS,BUILD,SOURCES,SPECS,tmp}

VERSION=$1
WORKDIR=`pwd`

cat <<EOF >~/.rpmmacros
%_topdir   %(echo $HOME)/rpmbuild
%_tmppath  %{_topdir}/tmp
%_signature gpg
%_gpg_path /root/.gnupg
%_gpg_name QuantumBytes inc.
%_gpgbin /usr/bin/gpg
EOF

cp ROALauncher ~/rpmbuild
cd ~/rpmbuild

# GPG stuff
echo $GPG_PRI > gpg.key.b64
echo $GPG_PUB > gpg.pub.b64

base64 -d gpg.pub.b64 > gpg.pub
base64 -d gpg.key.b64 > gpg.key

gpg --import gpg.pub
gpg --import gpg.key
rpm --import gpg.pub


mkdir ROAL-$VERSION
mkdir -p ROAL-$VERSION/usr/bin
mkdir -p ROAL-$VERSION/usr/share/applications
mkdir -p ROAL-$VERSION/usr/share/icons/hicolor/48x48/apps

install -m 755 ROALauncher ROAL-$VERSION/usr/bin
install -m 755 $WORKDIR/pkg/shared/ROALauncher.desktop ROAL-$VERSION/usr/share/applications/
install -m 755 $WORKDIR/resources/images/icon.png ROAL-$VERSION/usr/share/icons/hicolor/48x48/apps/ROALauncher.png

tar -zcvf ROAL-$VERSION.tar.gz ROAL-$VERSION/

cp ROAL-$VERSION.tar.gz SOURCES/

cat <<EOF > SPECS/ROAL.spec
# Don't try fancy stuff like debuginfo, which is useless on binary-only
# packages. Don't strip binary too
# Be sure buildpolicy set to do nothing
%define        __spec_install_post %{nil}
%define          debug_package %{nil}
%define        __os_install_post %{_dbpath}/brp-compress

Summary: Relics of Annorath launcher
Name: ROAL
Version: $VERSION
Release: 1
License: GPL+
Group: Amusements/Games
SOURCE0 : %{name}-%{version}.tar.gz
URL: https://www.annorath-game.com

BuildRoot: %{_tmppath}/%{name}-%{version}-%{release}-root

%description
%{summary}

%prep
%setup -q

%build
# Empty section.

%install
rm -rf %{buildroot}
mkdir -p  %{buildroot}

# in builddir
cp -a * %{buildroot}


%clean
rm -rf %{buildroot}


%files
%defattr(-,root,root,-)
%{_bindir}/*
/usr/share/applications/ROALauncher.desktop
/usr/share/icons/hicolor/48x48/apps/ROALauncher.png

EOF

rpmbuild --sign -ba SPECS/ROAL.spec
