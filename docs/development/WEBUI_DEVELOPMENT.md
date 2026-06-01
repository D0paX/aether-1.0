# WebUI Development Guide

Status: To be written in Batch 06 (WebUI Build Pipeline).

## Overview

Aether's browser chrome (tabs, address bar, toolbar, sidebar) and browser pages (new tab, settings, history) are built with React + TypeScript. They run inside Chromium's WebUI system, served from the chrome:// scheme.

This document will cover:
- Setting up the React + TypeScript + Vite development pipeline
- Running the WebUI dev server independently of the browser build
- Connecting the WebUI build to the Chromium build system
- Mojo IPC bindings: communicating between TypeScript and C++
- Hot reload during development
- Testing React components

Prerequisites: Complete Batch 03 (working Brave build) before starting WebUI development.
