FROM node:18-bullseye

# Install Java and other tools needed for Android builds
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    wget unzip git \
 && rm -rf /var/lib/apt/lists/*

# Android SDK installation
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    cd $ANDROID_HOME/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O tools.zip && \
    unzip tools.zip && \
    mv cmdline-tools latest && \
    rm tools.zip && \
    yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# React Native CLI
RUN npm install -g react-native-cli

WORKDIR /app

CMD ["bash"]
