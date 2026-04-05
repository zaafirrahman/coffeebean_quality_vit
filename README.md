# ☕ Arabica Coffee Bean Quality Classification using Vision Transformer (ViT)

> Skripsi — Teknik Industri Pertanian, Universitas Brawijaya

[![Dataset](https://img.shields.io/badge/Dataset-Kaggle-20BEFF?logo=kaggle)](https://www.kaggle.com/datasets/zaafirrahman/arabica-beans)
[![Model](https://img.shields.io/badge/Model-HuggingFace-FFD21E?logo=huggingface)](https://huggingface.co/zaafirrahman)
[![Demo](https://img.shields.io/badge/Demo-GitHub%20Pages-222?logo=github)](https://zaafirrahman.github.io/coffeebean-quality-vit/docs/index.html)
[![Thesis](https://img.shields.io/badge/Thesis-PDF-red?logo=adobeacrobatreader)](https://github.com/zaafirrahman/coffeebean_quality_vit/releases/tag/v1.0.0)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📌 Overview

Visual inspection of Arabica coffee beans is prone to **subjectivity and inconsistency** — operators can disagree on defect severity, and the process is time-consuming at scale. This research applies **Vision Transformer (ViT)** to automate quality classification based on the Indonesian National Standard (SNI) defect value system using digital images.

ViT divides images into small patches and processes them through Transformer blocks with a **self-attention mechanism**, enabling the model to capture global relationships between image regions — producing more abstract and robust representations compared to conventional CNNs.

---

## 🏆 Key Results

| Model | Patch Size | Train:Test | Accuracy |
|---|---|---|---|
| **ViT ImageNet** ⭐ | 16×16 px | 70:30 | **91.67%** |
| ViT HuggingFace | 16×16 px | 80:20 | 90.00% |
| MobileNetV2 (baseline) | — | 70:30 | 86.67% |

**Best model: ViT ImageNet (ViT-B/16)** outperforms MobileNetV2 by **+5% accuracy** and **+2 images/second** prediction speed, though with a significantly larger model size (~320 MB difference).

---

## 🗂️ Quality Classes (SNI)

This model classifies Arabica beans into **6 quality grades** based on the SNI defect value system:

| Grade | Description |
|---|---|
| Specialty | 0 defects per 300g sample |
| Grade 1 | Max 11 defect values |
| Grade 2 | 12–25 defect values |
| Grade 3 | 26–44 defect values |
| Grade 4a | 45–60 defect values |
| Grade 4b | 61–80 defect values |

---

## 📁 Repository Structure

```
coffeebean-quality-vit/
├── notebooks/
│   ├── training/          # Training notebooks (ViT-B/16, ViT-B/32 × ImageNet, HuggingFace + MobileNetV2)
│   └── prediction/        # Prediction notebooks (matching each training config)
├── outputs/
│   ├── metrics/           # CSV — accuracy, loss, F1 per experiment
│   ├── heatmaps/          # Grad-CAM visualizations
│   └── charts/            # Training curves (loss/accuracy plots)
├── web/                   # GitHub Pages demo (onnxruntime-web inference)
├── .gitignore
└── README.md
```

> **Dataset**: Not included in this repo — available on [Kaggle](https://www.kaggle.com/datasets/zaafirrahman/arabica-beans)
>
> **Trained models**: Available on [HuggingFace Hub](https://huggingface.co/zaafirrahman) (`.onnx` quantized for web demo)

---

## 🧪 Experiment Configurations

Each notebook covers one model variant. Train:test split can be adjusted manually in the respective cells.

| Notebook | Architecture | Pretrain Source | Patch Size |
|---|---|---|---|
| `vit_b16_imagenet` | ViT-B/16 | ImageNet-21k | 16×16 px |
| `vit_b32_imagenet` | ViT-B/32 | ImageNet-21k | 32×32 px |
| `vit_b16_huggingface` | ViT-B/16 | HuggingFace | 16×16 px |
| `vit_b32_huggingface` | ViT-B/32 | HuggingFace | 32×32 px |
| `mobilenetv2_baseline` | MobileNetV2 | ImageNet | — |

---

## ⚙️ Dependencies

```
Python        3.10+
PyTorch       2.x
timm
torchvision
transformers  (HuggingFace)
numpy
pandas
matplotlib
scikit-learn
Pillow
```

---

## 🌐 Web Demo

A live classification demo is available at **[zaafirrahman.github.io/coffeebean-quality-vit](https://zaafirrahman.github.io/coffeebean-quality-vit)** — upload a photo of Arabica beans and get instant quality classification, powered by the quantized ONNX model running entirely in-browser via `onnxruntime-web`. No server required.

---

## 📄 Citation

If you use this work or dataset, please cite:

```bibtex
@thesis{zaafirrahman2024vit,
  author      = {Aulya Az Zaafirrahman},
  title       = {Klasifikasi Mutu Biji Kopi Arabika Berbasis Image Processing Menggunakan Metode Vision Transformer (ViT)},
  institution = {Universitas Brawijaya},
  department  = {Teknik Industri Pertanian},
  year        = {2024}
}
```

---

## 👤 Author

**Aulya Az Zaafirrahman** |
Agroindustrial Engineering — Universitas Brawijaya

[![Kaggle](https://img.shields.io/badge/Kaggle-zaafirrahman-20BEFF?logo=kaggle)](https://www.kaggle.com/zaafirrahman)
[![HuggingFace](https://img.shields.io/badge/HuggingFace-zaafirrahman-FFD21E?logo=huggingface)](https://huggingface.co/zaafirrahman)

---

*Dataset published on Kaggle. Trained models available on HuggingFace Hub. Web demo runs fully client-side via onnxruntime-web.*