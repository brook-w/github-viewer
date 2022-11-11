cd F:\CodeSpace\JsDev\github-viewer
zip -q dist.zip -r dist\
scp -r  F:\CodeSpace\JsDev\github-viewer\dist.zip root@101.200.175.79:/root/upload
ssh root@101.200.175.79 "rm -rf /www/wwwroot/github-viewer.brook-w.com/* && unzip /root/upload/dist.zip -d  /root/upload && mv /root/upload/dist/* /www/wwwroot/github-viewer.brook-w.com/ && rm -rf /root/upload/dist*"
