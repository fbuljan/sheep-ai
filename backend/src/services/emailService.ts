import nodemailer from 'nodemailer';
import { UserService } from './userService';
import { DisplayTypeService } from './displayTypeService';
import { ChatGptService } from './chatGptService';
import { displayTypes } from '../models/displayType';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  userName: string;
  frequency: string;
  userId: number;
}

interface ArticleData {
  title?: string;
  summary?: string;
  url?: string;
  imageUrl?: string;
}

export async function sendNotificationEmail(options: EmailOptions): Promise<void> {
  const { to, subject, userName, frequency, userId } = options;

  const userService = new UserService();
  const displayTypeService = new DisplayTypeService();
  const chatGptService = new ChatGptService();

  // Get user's preferred websites
  const user = await userService.getUserById(userId);
  const preferredWebsites = user?.preferredWebsites || [];
  const firstSource = preferredWebsites[0] || 'thehackernews';

  // Get articles for user's preferred categories
  const { articles } = await userService.getArticlesByPreferredCategories(userId, firstSource, 10);

  // Get user's preferred display types
  let userDisplayTypes = await displayTypeService.getUserDisplayPreferences(userId);
  if (userDisplayTypes.length === 0) {
    userDisplayTypes = displayTypes;
  }

  // Select random article and display type
  const randomArticle = articles.length > 0 ? articles[Math.floor(Math.random() * articles.length)] : null;
  const randomDisplayType = userDisplayTypes[Math.floor(Math.random() * userDisplayTypes.length)];

  let articleSummaryHtml = '';
  let articleTitle = '';
  let articleUrl = '';

  if (randomArticle && randomDisplayType) {
    const articleData = randomArticle.data as ArticleData;
    articleTitle = articleData.title || 'Untitled Article';
    articleUrl = randomArticle.url;

    try {
      // Generate summary
      const summaryResult = await chatGptService.generateArticleSummary(articleUrl, randomDisplayType);
      // Convert markdown to HTML
      articleSummaryHtml = await chatGptService.convertMarkdownToHtml(summaryResult.content);
    } catch (error) {
      console.error('[Email Service] Failed to generate article summary:', error);
      articleSummaryHtml = `<p style="color: #666666; font-size: 14px; line-height: 1.6;">${articleData.summary || 'Check out this interesting article on our platform.'}</p>`;
    }
  }

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SIKUM Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 0;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">
                SIKUM
              </h1>
              <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
                Your personalized news digest
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px; font-weight: 600;">
                Hi ${userName}! 👋
              </h2>
              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                Here's your <strong>${frequency}</strong> digest of personalized news and insights curated just for you by SIKUM.
              </p>

              ${randomArticle ? `
              <!-- Featured Article -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <tr>
                  <td style="background-color: #f8f9fa; border-radius: 8px; padding: 25px;">
                    <h3 style="margin: 0 0 15px; color: #333333; font-size: 18px; font-weight: 600;">
                      📰 Featured Article
                    </h3>
                    <h4 style="margin: 0 0 15px; color: #667eea; font-size: 16px; font-weight: 600;">
                      ${articleTitle}
                    </h4>
                    <div style="color: #666666; font-size: 14px; line-height: 1.6;">
                      ${articleSummaryHtml}
                    </div>
                    <a href="${articleUrl}" style="display: inline-block; margin-top: 15px; color: #667eea; text-decoration: none; font-weight: 600; font-size: 14px;">
                      Read full article →
                    </a>
                  </td>
                </tr>
              </table>
              ` : `
              <!-- No Articles Available -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <tr>
                  <td style="background-color: #f8f9fa; border-radius: 8px; padding: 25px;">
                    <h3 style="margin: 0 0 15px; color: #333333; font-size: 18px; font-weight: 600;">
                      📰 What's New Today
                    </h3>
                    <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      Stay informed with the latest updates from your favorite sources. Visit your dashboard to explore personalized content.
                    </p>
                  </td>
                </tr>
              </table>
              `}

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="text-align: center; padding: 20px 0;">
                    <a href="https://sheep-ai.vercel.app/" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      View More Articles
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="margin: 0 0 10px; color: #999999; font-size: 14px;">
                You're receiving this because you subscribed to ${frequency} notifications.
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} SIKUM. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const mailOptions = {
    from: '"SIKUM" <sikum.notifications@gmail.com>',
    to,
    subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`[Email Service] Failed to send email to ${to}:`, error);
  }
}
