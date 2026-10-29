#!/bin/bash
set -e

ADB="/Users/arda/Library/Android/sdk/platform-tools/adb"
BACKUP_DIR="/Users/arda/Desktop/project/clock-os-backup"

mkdir -p "$BACKUP_DIR/system_info"
mkdir -p "$BACKUP_DIR/apks"
mkdir -p "$BACKUP_DIR/app_data"
mkdir -p "$BACKUP_DIR/system_apps/app"
mkdir -p "$BACKUP_DIR/system_apps/priv-app"
mkdir -p "$BACKUP_DIR/sdcard"
mkdir -p "$BACKUP_DIR/partitions"

echo "=== [1/6] Saving device properties, build.prop, package list & mount info ==="
"$ADB" shell getprop > "$BACKUP_DIR/system_info/getprop.txt"
"$ADB" shell pm list packages -u -f > "$BACKUP_DIR/system_info/packages_all.txt"
"$ADB" shell dumpsys package com.yij.outdoor > "$BACKUP_DIR/system_info/dumpsys_com_yij_outdoor.txt"
"$ADB" shell df > "$BACKUP_DIR/system_info/df.txt"
"$ADB" shell mount > "$BACKUP_DIR/system_info/mount.txt"
"$ADB" shell cat /proc/partitions > "$BACKUP_DIR/system_info/partitions.txt"
"$ADB" shell ls -la /dev/block/by-name > "$BACKUP_DIR/system_info/by-name.txt"
"$ADB" pull /system/build.prop "$BACKUP_DIR/system_info/build.prop"

echo "=== [2/6] Backing up original Adhan Clock app (/data/app/com.yij.outdoor-1) ==="
"$ADB" pull /data/app/com.yij.outdoor-1 "$BACKUP_DIR/apks/com.yij.outdoor-1"

echo "=== [3/6] Backing up original Adhan Clock app data (/data/data/com.yij.outdoor) ==="
"$ADB" pull /data/data/com.yij.outdoor "$BACKUP_DIR/app_data/com.yij.outdoor"

echo "=== [4/6] Backing up /sdcard contents ==="
"$ADB" pull /sdcard/ "$BACKUP_DIR/sdcard/"

echo "=== [5/6] Backing up /system/priv-app and /system/app ==="
"$ADB" pull /system/priv-app/ "$BACKUP_DIR/system_apps/priv-app/"
"$ADB" pull /system/app/ "$BACKUP_DIR/system_apps/app/"

echo "=== [6/6] Backing up critical OS boot/recovery/bootloader/env partitions ==="
for part in bootloader env boot misc recovery metadata private frp; do
  echo "Pulling partition: $part.img ..."
  "$ADB" shell "dd if=/dev/block/by-name/$part 2>/dev/null" > "$BACKUP_DIR/partitions/${part}.img" || true
done

echo "=== Backup Complete! ==="
du -sh "$BACKUP_DIR"/*

