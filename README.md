To run test produce the following steps

1. Download last stable Node.js version 
https://nodejs.org/en/download/

2. Install Node.js, default installation 

3. Open command line
   Run
Windows: npm install -g protractor
Unix:    sudo npm install -g protractor

4. Run in command line
Windows: webdriwer-manager update
Unix:    sudo webdriver-manager update

5. Run in command line
Windows: webdriwer-manager start
Unix:    sudo webdriver-manager start

6. Unpack archive with the test

7. Open another command line window 
go to test deirectory in unpacked directory
run
Windows:
npm install jasmine-spec-reporter --save-dev
npm install accounting  --save-dev
Unix:
sudo npm install jasmine-spec-reporter --save-dev
sudo npm install accounting  --save-dev

go to test\e2e
run protractor