#!/bin/bash
# Publishes built RPMs to an s3-backed RPM repo.
# Origin: http://tylerpower.io/post/hosting-yum-repo-on-s3/


SCRIPT_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
SRC_BASE="${SCRIPT_DIR}/../.."

DEPENDENCIES=("aws" "createrepo")
REGION="us-east-1"
SOURCE_DIR=""
TARGET_BUCKET=""

for dep in "${DEPENDENCIES[@]}"
do
  if [ ! $(which ${dep}) ]; then
      echo "${dep} must be available."
      exit 1
  fi
done

while getopts "s:t:" opt; do
  case $opt in
    s) SOURCE_DIR=$OPTARG ;;
    t) TARGET_BUCKET=$OPTARG ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

if [ -z "${SOURCE_DIR}" ]; then
  echo "Source directory must be specified."
  exit 1
fi

if [ -z "${TARGET_BUCKET}" ]; then
  echo "Target bucket must be specified."
  exit 1
fi

TARGET_DIR="/tmp/${TARGET_BUCKET}"

# make sure we're operating on the latest data in the target bucket
mkdir -p $TARGET_DIR
aws --region "${REGION}" s3 sync "s3://${TARGET_BUCKET}" $TARGET_DIR

# copy the RPM in and update the repo
mkdir -pv $TARGET_DIR/x86_64/
cp -rv $SOURCE_DIR/RPMS/* $TARGET_DIR
UPDATE=""
if [ -e "$TARGET_DIR/x86_64/repodata/repomd.xml" ]; then
  UPDATE="--update "
fi
for a in $TARGET_DIR/x86_64 ; do createrepo -v $UPDATE --deltas $a/ ; done

# sync the repo state back to s3
aws --region "${REGION}" s3 sync $TARGET_DIR s3://$TARGET_BUCKET
