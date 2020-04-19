#include <math.h>
#include <stdlib.h>
#include <stdio.h>

void grayScale(unsigned char* data, int w, int h) {
  int len = w * h;
  for (int i = 0; i < len; i ++) {
    int j = i * 4;
    int r = data[j];
    int g = data[j+1];
    int b = data[j+2];
    int a = data[j+3];
    data[j] = r;
    data[j+1] = r;
    data[j+2] = r;
    data[j+3] = a;
  }
}

void mixWithColor(unsigned char* data, int w, int h, int r, int g, int b, float opacity) {
  int len = w * h;
  int mix_red_offset = r * opacity;
  int mix_green_offset = g * opacity;
  int mix_blue_offset = b * opacity;
  int rgb_offset[3] = { mix_red_offset, mix_green_offset, mix_blue_offset };
  float factor = 1.0f - opacity;

  for (int i = 0; i < len; i ++) {
    int j = i * 4;
    for (int a = 0; a < 3; a ++) {
      data[j + a] = rgb_offset[a] + data[j + a] * factor;
    }
  }
}

void boxFilter(unsigned char* data, int w, int h,
  float a0, float a1, float a2,
  float a3, float a4, float a5,
  float a6, float a7, float a8) {
  float mat[3][3] = {
    {a0, a1, a2},
    {a3, a4, a5},
    {a6, a7, a8}
  };
  for (int i = 0; i < h; i ++) {
    for (int j = 0; j < w; j ++) {
      for (int a = 0; a < 4; a ++) {
        int v = 0;
        int idx = (i * w + j) * 4 + a;
        for (int k = -1; k <= 1; k ++) {
          for (int l = -1; l <= 1; l ++) {
            int mx = j + k;
            int my = i + l;
            if (mx < 0 || my < 0 || mx >= w || my >= h) continue;
            int midx =(my * w + mx) * 4 + a;
            v += data[midx] * mat[k + 1][l + 1];
          }
        }
        data[idx] = v;
      }
    }
  }
}