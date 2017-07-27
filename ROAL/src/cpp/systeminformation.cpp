#include "../h/systeminformation.h"

SystemInformation::SystemInformation()
{
    OSName = QSysInfo::machineHostName();
    OSType = QSysInfo::kernelType();
    OSVersion = QSysInfo::kernelVersion();
    installDir = QCoreApplication::applicationDirPath();
    LauncherVersion = ROA_LAUNCHER_VERSION;
    QTBuildInformations = QSysInfo::buildAbi();
    SystemLanguage = QLocale::system().uiLanguages()[0];
    RoAConfigVersion = ROA_CONFIG_VERSION;
    HostIP = getHostIP();
    FreeSpace = getFreeSpace();
}

QString SystemInformation::getSystemInformation()
{
    return "OSName:  " + OSName + " " +
           "OSType: " + OSType + " " +
           "OSVersion: " + OSVersion + " " +
           "InstallDir: " + installDir + " " +
           "Launcher Version: " + LauncherVersion + " " +
           "QTBuildInformations: " + QTBuildInformations + " " +
           "SystemLanguage: " + SystemLanguage + " " +
           "ConfigVersion: " + RoAConfigVersion + " " +
           "IpProtocoll: " + HostIP + " " +
           "Storage: " + FreeSpace;

}

QString SystemInformation::getHostIP()
{
    QString ret = "";
    QHostAddress local = QHostAddress::LocalHost;
    if(local.protocol() == QTcpSocket::IPv4Protocol)
        ret += "IPv4";
    if(local.protocol() == QTcpSocket::IPv6Protocol)
        ret += "IPv6";
    return ret;
}

QString SystemInformation::getFreeSpace()
{
    QString informations;
    QStorageInfo storage = QStorageInfo::root();

      informations += storage.rootPath();
      if (storage.isReadOnly())
          informations += "isReadOnly:" + storage.isReadOnly();

      informations += "name:" + storage.name() + " ";
      informations += "fileSystemType:" + storage.fileSystemType() + " ";
      //informations += "size:" + storage.bytesTotal();
      //informations += "availableSize:" + storage.bytesAvailable();

      return informations;
}
