# 📸 AI-Enhanced Image Generator App

A mobile application built with **Expo** and **React Native** that combines **random images** from [Picsum Photos](https://picsum.photos/) with AI image generation using [Hugging Face Inference API](https://huggingface.co/docs/inference-providers/en/providers/hf-inference).

---

## 🚀 Features

- 🖼️ Fetches high-quality random images from [Picsum Photos](https://picsum.photos/)
- 🧠 Generates descriptive captions using Hugging Face's `black-forest-labs/FLUX.1-dev` model
- ⚙️ Built with **Expo** and **React Native**
- 🆓 Operates on **Hugging Face's free tier** (with limitations)

---

## 🛠️ Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Image Source API:** [Picsum Photos](https://picsum.photos/)
- **AI Caption Model:** [Hugging Face FLUX.1-dev](https://huggingface.co/black-forest-labs/FLUX.1-dev)

---

## ⚠️ Usage Limits

> The app uses the **Hugging Face free tier**, which has a strict monthly usage cap of **$0.10**.

- After exceeding this quota, **AI image generation will be disabled** until the beginning of the next billing cycle.
- The image fetching from Picsum will continue to work as it does not incur costs.

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root of your project:

```
HUGGING_FACE_API_KEY=your_huggingface_api_key_here
```

> ⚠️ **Do not commit your `.env` file.** Make sure it's listed in `.gitignore`.

### 4. Run the App

```bash
npx expo start
```

---

## 🧪 How It Works

1. The home page loads random images from `https://picsum.photos/`.
2. The image gen page uses Hugging Face’s `FLUX.1-dev` model via the Inference API.
3. Dynamic download links are made available to the user for images that they wish to save.

---

## 📄 Notes

- Hugging Face models may experience temporary latency or fail under high load—especially on free-tier limits.
- Ensure your API key is valid and the `.env` file is correctly configured.
- No user authentication or data storage is implemented in this version.

---

## 📝 License

This project is released under the MIT License.

---

## 🙌 Acknowledgements

- [Picsum Photos](https://picsum.photos/) for free image API
- [Hugging Face](https://huggingface.co/) for cutting-edge AI model access
