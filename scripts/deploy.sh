#!/bin/sh
set -e

PROJECT_NAME="ops-client"
AccessKeyId=$1
AccessKeySecret=$2
Bucket=$3
Endpoint=$4
SSHPass=$5
SCPPath=$6
GITUSER=$7
ENV=$8

prepare() {
    echo "node -v: `node -v`"
    echo "yarn -v: `yarn -v`"
    echo "deploy start"
    echo ""
}

install_build() {
    yarn install --registry=https://npm.papegames.com
    yarn build:$ENV
    echo "build done $ENV"
}

trans_env() {
    BUSINESS_NAME="admin"
    if [ $ENV != "prod" ]
    then
        BUSINESS_NAME=${BUSINESS_NAME}-${ENV}
    fi
    OSS_PATH=${BUSINESS_NAME}/${PROJECT_NAME}
}

upload_oss() {
    echo "upload oss start"
    cd dist
    dpack oss ${BUSINESS_NAME} --akid ${AccessKeyId} --aksc ${AccessKeySecret} --bucket ${Bucket} --endpoint ${Endpoint}
    cd ..
    echo "upload oss end"
}

scp_itsm() {
    echo "scp html start"
    dpack zip --type html --name ${PROJECT_NAME}
    zipFile=$(ls | grep .tar.gz)
    export SSHPASS=${SSHPass}
    sshpass -e scp -o StrictHostKeyChecking=no -r ${zipFile} ${SCPPath}
    echo ""
    echo "🎉🎉🎉 deploy successfully"
    echo "🎉🎉🎉 usage: ${zipFile}"

    echo "【${PROJECT_NAME}】提单-${GITUSER}"
    dpack itsm "【${PROJECT_NAME}】提单-${GITUSER}" ${PROJECT_NAME} ${zipFile} ${GITUSER}
    echo "🎉🎉🎉 all success done!!!"
}

__main() {
    prepare
    install_build
    trans_env
    upload_oss
    if [ $ENV = "prod" ]
    then
        mv dist/${OSS_PATH}/index.html dist/index.html
        scp_itsm
    fi
}

__main