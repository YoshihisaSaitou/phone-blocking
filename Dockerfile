# syntax=docker/dockerfile:1
# -----------------------------------------------------------------------------
# React Native 開発 + Android エミュレータ (AVD) 同梱 Dockerfile
#   * Node.js 20 (React Native CLI 実行用)
#   * OpenJDK 17 (Android Gradle 8 以降用)
#   * Android SDK / command‑line tools
#   * Pixel 6, API‑34, Google APIs x86_64 system‑image → ci-avd という AVD を生成
#   * AVD は -no-window ヘッドレス起動を想定（GPU: swiftshader）
# -----------------------------------------------------------------------------

FROM node:20-bullseye AS base

ENV DEBIAN_FRONTEND=noninteractive \
    ANDROID_HOME=/opt/android-sdk \
    PATH="$PATH:/opt/android-sdk/cmdline-tools/latest/bin:/opt/android-sdk/emulator:/opt/android-sdk/platform-tools"

# -----------------------------------------------------------------------------
# 1️⃣  OS パッケージ / 依存ライブラリ
# ----------------------------------------------------------------------------
RUN dpkg --add-architecture i386 && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        openjdk-17-jdk-headless \
        wget unzip \
        # 32bit ライブラリ（エミュレータが依存）
        libc6:i386 libstdc++6:i386 libgcc-s1:i386 libtinfo6:i386 libzstd1:i386 zlib1g:i386 \
        libpulse0 libgl1-mesa-dev && \
    rm -rf /var/lib/apt/lists/*

# -----------------------------------------------------------------------------
# 2️⃣  Android command‑line tools & SDK
# -----------------------------------------------------------------------------
RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    cd /tmp && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmd.zip && \
    unzip -q cmd.zip && rm cmd.zip && \
    mv cmdline-tools $ANDROID_HOME/cmdline-tools/latest

# SDK パッケージインストール & ライセンス自動承諾
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "emulator" \
              "platforms;android-34" \
              "system-images;android-34;google_apis;x86_64"

# -----------------------------------------------------------------------------
# 3️⃣  デフォルト AVD を作成
# -----------------------------------------------------------------------------
RUN echo "no" | avdmanager create avd -n ci-avd \
      -k "system-images;android-34;google_apis;x86_64" \
      --device "pixel_6" --force

# -----------------------------------------------------------------------------
# 4️⃣  アプリ依存ファイルのセットアップ
# -----------------------------------------------------------------------------
WORKDIR /PhoneBlockingApp
COPY ./PhoneBlockingApp/package*.json ./
RUN npm install

COPY . .

# -----------------------------------------------------------------------------
# 5️⃣  ポート公開
#  * 8081  → Metro Bundler
#  * 5554/5555 → AVD console / ADB
# -----------------------------------------------------------------------------
EXPOSE 8081 5554 5555

# -----------------------------------------------------------------------------
# 6️⃣  起動コマンド
#    AVD をバックグラウンドで起動 → ブート完了を待って Metro と Android ビルド
# -----------------------------------------------------------------------------
CMD bash -c "\
    emulator -avd ci-avd -no-window -no-audio -gpu swiftshader_indirect -accel on -port 5554 &\
    adb wait-for-device shell 'while [ \`getprop sys.boot_completed\` -ne 1 ]; do sleep 1; done' &&\
    npx react-native start"
