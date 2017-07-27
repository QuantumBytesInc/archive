import os

from setuptools import setup, find_packages

version = '1.0.0'


def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()


setup(name='django-stackdriver-logging',
      version=version,
      description="Django stackdriver logging client",
      long_description=read('README.md'),
      classifiers=[
          "Development Status :: 5 - Production/Stable",
          "Environment :: Web Environment",
          "Framework :: Django",
          "Framework :: Django :: 1.5",
          "Framework :: Django :: 1.6",
          "Framework :: Django :: 1.7",
          "Framework :: Django :: 1.8",
          "Framework :: Django :: 1.9",
          "Framework :: Django :: 1.10",
          "Intended Audience :: Developers",
          "Natural Language :: English",
          "Operating System :: OS Independent",
          "Programming Language :: Python",
          "Programming Language :: Python :: 3",
          "Programming Language :: Python :: 2",
          "Topic :: System :: Logging",
          "Topic :: Utilities",
          "License :: OSI Approved :: GNU General Public License v3 or later (GPLv3+)",
          ],
      install_requires=[
          'google-cloud',
          ],
      keywords='django stackdriver logging',
      author='Manuel Gysin, QuantumBytes inc.',
      author_email='manuel.gysin@quantum-bytes.com',
      url='https://github.com/QuantumBytesInc/django-stackdriver-logging/',
      license='GPLv3',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=True,
      )
