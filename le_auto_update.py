"""
Python imports
"""
import yaml
import traceback
import ConfigParser
import logging
import sys
import boto3
import os
import time
from OpenSSL import crypto as c
from datetime import datetime, timedelta
from string import Template
from subprocess import check_output


processenv = os.environ.copy()


class StorageAWS:
    """
    Storage class for AWS access
    """
    def __init__(self, access, secret, bucket):
        self.client = boto3.client(
                        's3',
                        aws_access_key_id=access,
                        aws_secret_access_key=secret)
        self.bucket = bucket

    def save_work(self, path):
        for root, dirs, files in os.walk(path):
            for file in files:
                self.client.upload_fileobj(open(os.path.join(root, file), mode='rb'), self.bucket,
                                           os.path.join(root, file)[1:])

    def get_data(self):
        self.__download_dir__('app/', '/')

    def __download_dir__(self, dist, local='/tmp'):
        """
        Source:
        http://stackoverflow.com/questions/31918960/boto3-to-download-all-files-from-a-s3-bucket?answertab=votes#tab-top
        :param resource:
        :param dist:
        :param local:
        :param bucket:
        :return:
        """
        paginator = self.client.get_paginator('list_objects')
        for result in paginator.paginate(Bucket=self.bucket, Delimiter='/', Prefix=dist):
            if result.get('CommonPrefixes') is not None:
                for subdir in result.get('CommonPrefixes'):
                    self.__download_dir__(subdir.get('Prefix'), local)
            if result.get('Contents') is not None:
                for file in result.get('Contents'):
                    if not os.path.exists(os.path.dirname(local + os.sep + file.get('Key'))):
                         os.makedirs(os.path.dirname(local + os.sep + file.get('Key')))
                    self.client.download_file(self.bucket, file.get('Key'), local + os.sep + file.get('Key'))


class SSLService:
    """
    Service class for web services with SSL.
    """
    def __init__(self, name, host, mail, port, ip, selector):
        """
        Init the service instance.
        :param name: The service name
        :param host: The service host
        :param mail: Contact e-mail
        :param port: The target port
        :param ip: the target IP
        :param san: SAN certificate
        :param prefixes: Prefixed for SAN, if used
        :param sslpath: Path for saving certificates
        :return:
        """
        print('Validate/Check certificate for ' + host)

        # Init the instance
        self.name = name
        self.port = port
        self.mail = mail.replace('_at_', '@')
        self.host = host
        self.ip = ip
        self.selector = selector
        self.certificate = False
        self.needs_update = False

        try:
            self.uid = self.host.split(',')[0]
        except Exception:
            self.uid = self.host

    def create_service(self, config):
        """
        Get certificates from S3.
        :return:
        """
        if Certificate(self, config).stage():
            # Create nginx configuration
            nginx = Nginx.get_configuration(self.uid,
                                           self.host,
                                           self.port,
                                           self.ip,
                                           config.get('Nginx', 'Template'))

            # Save nginx
            if self.needs_update or not os.path.exists('/app/staging/' + self.uid):
                with open('/app/staging/' + self.uid + '.conf', mode='w') as f:
                    f.write(nginx)
                self.needs_update = True

class Certificate:
    """
    Class for certificate handling.
    """
    def __init__(self, service, config):
        """
        Init certificate instance.
        :param service: The
        """
        self.service = service
        self.config = config

    def stage(self):
        logging.info('Creating/Renewing certificate')

        if os.path.exists('/app/.lego/certificates/' + self.service.uid + '.crt'):
            cert = c.load_certificate(c.FILETYPE_PEM, file('.lego/certificates/' + self.service.uid + '.crt').read())
            if datetime.strptime(cert.get_notAfter(),"%Y%m%d%H%M%SZ") - timedelta(days=5) < datetime.now():
                self._run_lego_()
                self.service.needs_update = True
        else:
            self._run_lego_()
            self.service.needs_update = True

        if not self.service.needs_update:
            logging.info('No updated needed')

        return True

    def _run_lego_(self):
        """
        Execute lego for checking/creating certificate.
        :return:
        """
        # Check if renew or not
        if os.path.exists('/app/.lego/certificates/' + self.service.uid + '.crt'):
            run_mode = 'renew'
        else:
            run_mode = 'run'

        args =  ['./lego',
                 '--email=' + self.service.mail,
                 '--dns=' + self.config.get('LEGO', 'DNS'),
                 '--server=' + self.config.get('LE', 'DirectoryURL'),
                 '--key-type=' + self.config.get('LE', 'KeyType'),
                 '--accept-tos']

        try:
            for domain in self.service.host.split(','):
                args.append('--domains=' + domain)
        except Exception:
            args.append('--domains=' + self.service.uid)

        args.append(run_mode)

        check_output(args=args, env=processenv)

class Nginx:
    """
    Class for nginx configuration.
    """
    @staticmethod
    def get_configuration(uid, host, port, ip, template):

        template = open('/conf/' + template)
        src = Template(template.read())

        server_names = ''
        rewrite = 'if ($host != "' + uid + '") {\nrewrite ^ $scheme://' + uid + '$request_uri permanent;\n}\n'

        try:
            for entry in host.split(','):
                server_names += entry + ' '
            server_names = server_names[:-1]
        except Exception:
            server_name = uid

        upstream = ip + ':' + port
        d = {'VIRTUAL_HOST': uid, 'VIRTUAL_HOST_PORT': port, 'VIRTUAL_UPSTREAM': upstream, 'SERVER_NAMES': server_names, 'CUSTOM_PART': rewrite}

        return src.substitute(d)


class Kubernetes:
    """
    Class for kubernetes service watcher.
    """
    def __init__(self, namespace):
        self.namespace = namespace

    def _read_data_(self):
        """
        Get data from yaml.
        :return:
        """
        services = []

        # Get running services
        res = check_output(['kubectl',
                            '--namespace=' + self.namespace,
                            'get',
                            'svc',
                            '-o',
                            'yaml'])

        docs = yaml.load_all(res)

        for item in docs:
            items = item['items']
            for entry in items:
                if 'labels' in entry['metadata']:
                    if 'le-host' in entry['metadata']['labels']:
                        try:
                            host = str(entry['metadata']['labels']['le-host'])
                            mail = str(entry['metadata']['labels']['le-mail'])
                            port = str(entry['metadata']['labels']['le-port'])
                            name = str(entry['metadata']['labels']['name'])
                            ip = str(entry['spec']['clusterIP'])
                            selector = str(entry['spec']['selector']['app'])

                            # Addtional hosts
                            counter = 2
                            while True:
                                try:
                                    host += ',' + str(entry['metadata']['labels']['le-host-' + str(counter)])
                                    counter = counter + 1
                                except:
                                    break

                            logging.info('Found service: %s:%sm name: %s, ip: %s' %
                                         (host,
                                          port,
                                          name,
                                          ip))

                            services.append([name, host, mail, port, ip, selector])

                        except KeyError as e:
                            logging.error(e)
                            logging.debug(logging.debug(traceback.format_exc()))
                            pass
                    else:
                        logging.debug('Missing labels')
                else:
                    logging.debug('Missing metadata')

        return services

    def get_initial_services(self):
        """
        Get all running services.
        :return:
        """
        logging.info('Collecting all running services')

        # Get data and save
        return self._read_data_()

def run():
    """
    Main function to collect initial data and start watcher services.
    """
    services = []
    needs_update = False

    # Create staging area
    if not os.path.exists('/app/staging'):
        os.mkdir('/app/staging')

    # Get configuration
    config_qble = ConfigParser.ConfigParser()
    config_qble.read('/conf/qble.conf')

    # Set logging
    logging.basicConfig(stream=sys.stdout, level=config_qble.get('KUBELE', 'LogLevel'))
    logging.getLogger('botocore').setLevel(logging.ERROR)
    logging.getLogger('s3transfer').setLevel(logging.ERROR)
    logging.info('Starting...')

    # Set environment
    processenv['GCE_PROJECT'] = config_qble.get('GCLOUD', 'Project')
    processenv['GOOGLE_APPLICATION_CREDENTIALS'] = config_qble.get('GCLOUD', 'ServiceAccountPath')
    processenv['AWS_REGION'] = config_qble.get('AWS', 'Region')
    processenv['AWS_ACCESS_KEY_ID'] = config_qble.get('AWS', 'AccessKey')
    processenv['AWS_SECRET_ACCESS_KEY'] = config_qble.get('AWS', 'SecretKey')

    # Get all services
    kubernetes = Kubernetes(namespace=config_qble.get('Kubernetes', 'Namespace'))

    # Configure AWS
    client = StorageAWS(config_qble.get('AWS', 'AccessKey'),
                        config_qble.get('AWS', 'SecretKey'),
                        config_qble.get('AWS', 'Bucket'))

    # Downloading latest data from AWS
    #
    client.get_data()

    # Create services
    for service in kubernetes.get_initial_services():
        ssl = SSLService(name=service[0],
                                   host=service[1],
                                   mail=service[2],
                                   port=service[3],
                                   selector=service[5],
                                   ip=service[4])
        ssl.create_service(config_qble)
        services.append(ssl)

        needs_update |= ssl.needs_update

    # If any service was updated, create new deployment
    if needs_update:
        client.save_work('/app/staging/')
        client.save_work('/app/.lego/')

        # Update secret
        try:
            check_output(args=['kubectl',
                               'delete',
                               'secret',
                               'qbrp-ssl',
                               '--namespace=' + config_qble.get('Kubernetes', 'Namespace')])
        except Exception:
            None

        try:
            check_output(args=['kubectl',
                               'delete',
                               'secret',
                               'qbrp-conf',
                               '--namespace=' + config_qble.get('Kubernetes', 'Namespace')])
        except Exception:
            None

        args_files = []
        
        for service in services:
            args_files.append('--from-file=' + os.path.join('/app/staging/', service.uid + '.conf'))

        check_output(args=['kubectl',
                           'create',
                           'secret',
                           'generic',
                           'qbrp-conf',
                           '--namespace=' + config_qble.get('Kubernetes', 'Namespace')] + args_files)

        args_files = []
        for file in os.listdir('/app/.lego/certificates/'):
            args_files.append('--from-file=' + os.path.join('/app/.lego/certificates/', file))

        check_output(args=['kubectl',
                           'create',
                           'secret',
                           'generic',
                           'qbrp-ssl',
                           '--namespace=' + config_qble.get('Kubernetes', 'Namespace')] + args_files)

        # Update deployment
        check_output(args=['kubectl',
                           'patch',
                           'deployment',
                           '--namespace=' + config_qble.get('Kubernetes', 'Namespace'),
                           'qbrp',
                           '-p',
                           '{"spec":{"template":{"metadata":{"labels":{"date":"' + str(datetime.now()).replace(':', '_').replace('-', '_').replace(' ', '_') + '"}}}}}'])

def main():
    while True:
        run()
        time.sleep(120)


if __name__ == "__main__": main()

