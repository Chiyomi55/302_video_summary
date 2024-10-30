'use server'
import { logger } from '@/lib/logger'
import { produce } from 'immer'
import ky from 'ky'
import { env } from 'next-runtime-env'
interface TikTokApiResponse {
  code: number
  data: Data
  params: Params
  router: string
}

interface Params {
  share_url: string;
}
interface Data {
  aweme_details: Awemedetail[];
  aweme_status?: any;
  extra: Extra;
  log_pb: Logpb;
  status_code: number;
  status_msg: string;
}
interface Logpb {
  impr_id: string;
}
interface Extra {
  fatal_item_ids: any[];
  logid: string;
  now: number;
}
interface Awemedetail {
  added_sound_music_info: Addedsoundmusicinfo;
  aigc_info: Aigcinfo;
  allow_gift: boolean;
  anchors?: any;
  anchors_extras: string;
  author: Author;
  author_user_id: number;
  aweme_acl: Awemeacl;
  aweme_id: string;
  aweme_type: number;
  banners?: any;
  behind_the_song_music_ids?: any;
  behind_the_song_video_music_ids?: any;
  bodydance_score: number;
  branded_content_accounts?: any;
  cc_template_info: Cctemplateinfo;
  cha_list: Chalist[];
  challenge_position?: any;
  cmt_swt: boolean;
  collect_stat: number;
  comment_config: Commentconfig;
  comment_topbar_info?: any;
  commerce_config_data?: any;
  commerce_info: Commerceinfo;
  content_desc: string;
  content_desc_extra: any[];
  content_model: Contentmodel;
  cover_labels?: any;
  create_time: number;
  creation_info: Creationinfo;
  desc: string;
  desc_language: string;
  disable_search_trending_bar: boolean;
  distance: string;
  distribute_type: number;
  follow_up_publish_from_id: number;
  geofencing?: any;
  geofencing_regions?: any;
  green_screen_materials?: any;
  group_id: string;
  group_id_list: Groupidlist;
  has_danmaku: boolean;
  has_vs_entry: boolean;
  have_dashboard: boolean;
  hybrid_label?: any;
  image_infos?: any;
  interact_permission: Interactpermission;
  interaction_stickers?: any;
  is_ads: boolean;
  is_description_translatable: boolean;
  is_hash_tag: number;
  is_nff_or_nr: boolean;
  is_on_this_day: number;
  is_pgcshow: boolean;
  is_preview: number;
  is_relieve: boolean;
  is_text_sticker_translatable: boolean;
  is_title_translatable: boolean;
  is_top: number;
  is_vr: boolean;
  item_comment_settings: number;
  item_duet: number;
  item_react: number;
  item_stitch: number;
  label_top: Avatarmedium;
  label_top_text?: any;
  long_video?: any;
  main_arch_common: string;
  mask_infos: any[];
  misc_info: string;
  muf_comment_info_v2?: any;
  music: Addedsoundmusicinfo;
  music_begin_time_in_ms: number;
  music_selected_from: string;
  music_title_style: number;
  music_volume: string;
  need_trim_step: boolean;
  need_vs_entry: boolean;
  nickname_position?: any;
  no_selected_music: boolean;
  operator_boost_info?: any;
  origin_comment_ids?: any;
  origin_volume: string;
  original_client_text: Originalclienttext;
  picked_users: any[];
  playlist_blocked: boolean;
  poi_re_tag_signal: number;
  position?: any;
  prevent_download: boolean;
  products_info?: any;
  question_list?: any;
  rate: number;
  reference_tts_voice_ids?: any;
  reference_voice_filter_ids?: any;
  region: string;
  risk_infos: Riskinfos;
  search_highlight?: any;
  share_info: Shareinfo3;
  share_url: string;
  sort_label: string;
  statistics: Statistics;
  status: Status;
  support_danmaku: boolean;
  text_extra: Textextra2[];
  text_sticker_major_lang: string;
  title_language: string;
  tts_voice_ids?: any;
  ttt_product_recall_type: number;
  uniqid_position?: any;
  upvote_info: Upvoteinfo;
  upvote_preload: Upvotepreload;
  used_full_song: boolean;
  user_digged: number;
  video: Video;
  video_control: Videocontrol;
  video_labels: any[];
  video_text: any[];
  voice_filter_ids?: any;
  with_promotional_music: boolean;
  without_watermark: boolean;
}
interface Videocontrol {
  allow_download: boolean;
  allow_duet: boolean;
  allow_dynamic_wallpaper: boolean;
  allow_music: boolean;
  allow_react: boolean;
  allow_stitch: boolean;
  draft_progress_bar: number;
  prevent_download_type: number;
  share_type: number;
  show_progress_bar: number;
  timer_status: number;
}
interface Video {
  CoverTsp: number;
  ai_dynamic_cover: Aidynamiccover;
  ai_dynamic_cover_bak: Aidynamiccover;
  animated_cover: Aidynamiccover;
  big_thumbs: any[];
  bit_rate: Bitrate[];
  bit_rate_audio: any[];
  cdn_url_expired: number;
  cover: Avatarmedium;
  cover_is_custom: boolean;
  download_addr: Downloadaddr;
  duration: number;
  dynamic_cover: Avatarmedium;
  has_watermark: boolean;
  height: number;
  is_bytevc1: number;
  is_callback: boolean;
  meta: string;
  misc_download_addrs: string;
  need_set_token: boolean;
  origin_cover: Avatarmedium;
  play_addr: Playaddr;
  play_addr_bytevc1: Playaddr;
  play_addr_h264: Playaddr;
  ratio: string;
  source_HDR_type: number;
  tags?: any;
  width: number;
}
interface Downloadaddr {
  data_size: number;
  file_cs: string;
  height: number;
  uri: string;
  url_list: string[];
  url_prefix?: any;
  width: number;
}
interface Bitrate {
  HDR_bit: string;
  HDR_type: string;
  bit_rate: number;
  dub_infos?: any;
  gear_name: string;
  is_bytevc1: number;
  play_addr: Playaddr;
  quality_type: number;
  video_extra: string;
}
interface Playaddr {
  data_size: number;
  file_cs: string;
  file_hash: string;
  height: number;
  uri: string;
  url_key: string;
  url_list: string[];
  url_prefix?: any;
  width: number;
}
interface Aidynamiccover {
  uri: string;
  url_list: string[];
  url_prefix?: any;
}
interface Upvotepreload {
  need_pull_upvote_info: boolean;
}
interface Upvoteinfo {
  friends_recall_info: string;
  repost_initiate_score: number;
  user_upvoted: boolean;
}
interface Textextra2 {
  end: number;
  hashtag_id: string;
  hashtag_name: string;
  is_commerce: boolean;
  sec_uid: string;
  start: number;
  type: number;
  user_id: string;
}
interface Status {
  allow_comment: boolean;
  allow_share: boolean;
  aweme_id: string;
  download_status: number;
  in_reviewing: boolean;
  is_delete: boolean;
  is_prohibited: boolean;
  private_status: number;
  review_result: Reviewresult;
  reviewed: number;
  self_see: boolean;
}
interface Reviewresult {
  review_status: number;
}
interface Statistics {
  aweme_id: string;
  collect_count: number;
  comment_count: number;
  digg_count: number;
  download_count: number;
  forward_count: number;
  lose_comment_count: number;
  lose_count: number;
  play_count: number;
  repost_count: number;
  share_count: number;
  whatsapp_share_count: number;
}
interface Shareinfo3 {
  bool_persist: number;
  now_invitation_card_image_urls?: any;
  share_desc: string;
  share_desc_info: string;
  share_link_desc: string;
  share_quote: string;
  share_signature_desc: string;
  share_signature_url: string;
  share_title: string;
  share_title_myself: string;
  share_title_other: string;
  share_url: string;
  whatsapp_desc: string;
}
interface Riskinfos {
  content: string;
  risk_sink: boolean;
  type: number;
  vote: boolean;
  warn: boolean;
}
interface Originalclienttext {
  markup_text: string;
  text_extra: Textextra[];
}
interface Textextra {
  hashtag_name: string;
  tag_id: string;
  type: number;
  user_id: string;
}
interface Interactpermission {
  allow_adding_as_post: Allowaddingaspost;
  allow_adding_to_story: number;
  allow_create_sticker: Allowaddingaspost;
  allow_story_switch_to_post: Memesonginfo;
  duet: number;
  duet_privacy_setting: number;
  stitch: number;
  stitch_privacy_setting: number;
  upvote: number;
}
interface Allowaddingaspost {
  status: number;
}
interface Groupidlist {
  GroupdIdList0: number[];
  GroupdIdList1: number[];
}
interface Creationinfo {
  creation_used_functions: any[];
}
interface Contentmodel {
  custom_biz: Custombiz;
  standard_biz: Standardbiz;
}
interface Standardbiz {
  creator_analytics: Memesonginfo;
}
interface Custombiz {
  aweme_trace: string;
}
interface Commerceinfo {
  adv_promotable: boolean;
  auction_ad_invited: boolean;
  branded_content_type: number;
  with_comment_filter_words: boolean;
}
interface Commentconfig {
  emoji_recommend_list?: any;
  long_press_recommend_list?: any;
  preload: Preload;
  quick_comment: Quickcomment;
  quick_comment_emoji_recommend_list?: any;
}
interface Quickcomment {
  enabled: boolean;
}
interface Preload {
  preds: string;
}
interface Chalist {
  author: Author2;
  banner_list?: any;
  cha_attrs?: any;
  cha_name: string;
  cid: string;
  collect_stat: number;
  connect_music: any[];
  desc: string;
  extra_attr: Extraattr;
  hashtag_profile: string;
  is_challenge: number;
  is_commerce: boolean;
  is_pgcshow: boolean;
  schema: string;
  search_highlight?: any;
  share_info: Shareinfo2;
  show_items?: any;
  sub_type: number;
  type: number;
  use_count: number;
  user_count: number;
  view_count: number;
}
interface Shareinfo2 {
  bool_persist: number;
  now_invitation_card_image_urls?: any;
  share_desc: string;
  share_desc_info: string;
  share_quote: string;
  share_signature_desc: string;
  share_signature_url: string;
  share_title: string;
  share_title_myself: string;
  share_title_other: string;
  share_url: string;
}
interface Extraattr {
  is_live: boolean;
}
interface Author2 {
  account_labels?: any;
  ad_cover_url?: any;
  advance_feature_item_order?: any;
  advanced_feature_info?: any;
  bold_fields?: any;
  can_message_follow_status_list?: any;
  can_set_geofencing?: any;
  cha_list?: any;
  cover_url?: any;
  events?: any;
  followers_detail?: any;
  geofencing?: any;
  homepage_bottom_toast?: any;
  item_list?: any;
  mutual_relation_avatars?: any;
  need_points?: any;
  platform_sync_info?: any;
  relative_users?: any;
  search_highlight?: any;
  shield_edit_field_info?: any;
  type_label?: any;
  user_profile_guide?: any;
  user_tags?: any;
  white_cover_url?: any;
}
interface Cctemplateinfo {
  author_name: string;
  clip_count: number;
  desc: string;
  duration_milliseconds: number;
  related_music_id: string;
  template_id: string;
}
interface Awemeacl {
  download_general: Downloadgeneral;
  download_mask_panel: Downloadgeneral;
  platform_list?: any;
  press_action_list?: any;
  share_action_list?: any;
  share_general: Downloadgeneral;
  share_list_status: number;
}
interface Downloadgeneral {
  code: number;
  mute: boolean;
  show_type: number;
  transcode: number;
}
interface Author {
  accept_private_policy: boolean;
  account_labels?: any;
  account_region: string;
  ad_cover_url?: any;
  advance_feature_item_order?: any;
  advanced_feature_info?: any;
  apple_account: number;
  authority_status: number;
  avatar_168x168: Avatarmedium;
  avatar_300x300: Avatarmedium;
  avatar_larger: Avatarmedium;
  avatar_medium: Avatarmedium;
  avatar_thumb: Avatarmedium;
  avatar_uri: string;
  aweme_count: number;
  bind_phone: string;
  bold_fields?: any;
  can_message_follow_status_list: number[];
  can_set_geofencing?: any;
  cha_list?: any;
  comment_filter_status: number;
  comment_setting: number;
  commerce_user_level: number;
  cover_url: any[];
  create_time: number;
  custom_verify: string;
  cv_level: string;
  download_prompt_ts: number;
  download_setting: number;
  duet_setting: number;
  enabled_filter_all_comments: boolean;
  enterprise_verify_reason: string;
  events?: any;
  fake_data_info: Memesonginfo;
  favoriting_count: number;
  fb_expire_time: number;
  follow_status: number;
  follower_count: number;
  follower_status: number;
  followers_detail?: any;
  following_count: number;
  friends_status: number;
  geofencing?: any;
  google_account: string;
  has_email: boolean;
  has_facebook_token: boolean;
  has_insights: boolean;
  has_orders: boolean;
  has_twitter_token: boolean;
  has_youtube_token: boolean;
  hide_search: boolean;
  homepage_bottom_toast?: any;
  ins_id: string;
  is_ad_fake: boolean;
  is_block: boolean;
  is_discipline_member: boolean;
  is_mute: number;
  is_phone_binded: boolean;
  is_star: boolean;
  item_list?: any;
  language: string;
  live_agreement: number;
  live_commerce: boolean;
  live_verify: number;
  mention_status: number;
  mutual_relation_avatars?: any;
  need_points?: any;
  need_recommend: number;
  nickname: string;
  platform_sync_info?: any;
  prevent_download: boolean;
  react_setting: number;
  region: string;
  relative_users?: any;
  reply_with_video_flag: number;
  room_id: number;
  search_highlight?: any;
  sec_uid: string;
  secret: number;
  share_info: Shareinfo;
  share_qrcode_uri: string;
  shield_comment_notice: number;
  shield_digg_notice: number;
  shield_edit_field_info?: any;
  shield_follow_notice: number;
  short_id: string;
  show_image_bubble: boolean;
  signature: string;
  special_account: Specialaccount;
  special_lock: number;
  status: number;
  stitch_setting: number;
  story_status: number;
  total_favorited: number;
  tw_expire_time: number;
  twitter_id: string;
  twitter_name: string;
  type_label?: any;
  uid: string;
  unique_id: string;
  unique_id_modify_time: number;
  user_canceled: boolean;
  user_mode: number;
  user_now_pack_info: Memesonginfo;
  user_period: number;
  user_profile_guide?: any;
  user_rate: number;
  user_spark_info: Memesonginfo;
  user_tags?: any;
  verification_type: number;
  verify_info: string;
  video_icon: Shareqrcodeurl;
  white_cover_url?: any;
  with_commerce_entry: boolean;
  with_shop_entry: boolean;
  youtube_channel_id: string;
  youtube_channel_title: string;
  youtube_expire_time: number;
}
interface Specialaccount {
  special_account_list?: any;
}
interface Shareinfo {
  now_invitation_card_image_urls?: any;
  share_desc: string;
  share_desc_info: string;
  share_qrcode_url: Shareqrcodeurl;
  share_title: string;
  share_title_myself: string;
  share_title_other: string;
  share_url: string;
}
interface Shareqrcodeurl {
  height: number;
  uri: string;
  url_list: any[];
  url_prefix?: any;
  width: number;
}
interface Aigcinfo {
  aigc_label_type: number;
  created_by_ai: boolean;
}
interface Addedsoundmusicinfo {
  album: string;
  artists: any[];
  audition_duration: number;
  author: string;
  author_deleted: boolean;
  author_position?: any;
  avatar_medium: Avatarmedium;
  avatar_thumb: Avatarmedium;
  binded_challenge_id: number;
  can_not_reuse: boolean;
  collect_stat: number;
  commercial_right_type: number;
  cover_large: Avatarmedium;
  cover_medium: Avatarmedium;
  cover_thumb: Avatarmedium;
  dmv_auto_show: boolean;
  duration: number;
  duration_high_precision: Durationhighprecision;
  external_song_info: any[];
  extra: string;
  has_commerce_right: boolean;
  id: number;
  id_str: string;
  is_audio_url_with_cookie: boolean;
  is_author_artist: boolean;
  is_commerce_music: boolean;
  is_matched_metadata: boolean;
  is_original: boolean;
  is_original_sound: boolean;
  is_pgc: boolean;
  is_play_music: boolean;
  is_shooting_allow: boolean;
  log_extra: string;
  lyric_short_position?: any;
  meme_song_info: Memesonginfo;
  mid: string;
  multi_bit_rate_play_info?: any;
  mute_share: boolean;
  offline_desc: string;
  owner_handle: string;
  owner_id: string;
  owner_nickname: string;
  play_url: Avatarmedium;
  position?: any;
  prevent_download: boolean;
  preview_end_time: number;
  preview_start_time: number;
  recommend_status: number;
  search_highlight?: any;
  sec_uid: string;
  shoot_duration: number;
  source_platform: number;
  status: number;
  tag_list?: any;
  title: string;
  tt_to_dsp_song_infos?: any;
  uncert_artists?: any;
  user_count: number;
  video_duration: number;
}
interface Memesonginfo {
}
interface Durationhighprecision {
  audition_duration_precision: number;
  duration_precision: number;
  shoot_duration_precision: number;
  video_duration_precision: number;
}
interface Avatarmedium {
  height: number;
  uri: string;
  url_list: string[];
  url_prefix?: any;
  width: number;
}

export const getRealUrlForTiktok = async (id: string, apiKey: string) => {
  try {
    const API_URL = env('NEXT_PUBLIC_API_URL')!

    const response = await ky
      .get(`${API_URL}/tools/tiktok/app/v3/fetch_one_video_by_share_url`, {
        searchParams: {
          share_url: id,
        },
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 10000,
      })
      .json<TikTokApiResponse>()

    if (response.data.aweme_details.at(0)?.video.play_addr.url_list.at(0)) {
      const proxyUrl = `/api/video-proxy?url=${encodeURIComponent(response.data.aweme_details.at(0)?.video.play_addr.url_list.at(0) || '')}`
      const newResponse = produce(response, (draft) => {
        const video = draft.data.aweme_details.at(0)?.video
        if (video) {
          video.play_addr.url_list = [proxyUrl]
        }
      })

      return newResponse
    }

    return response
  } catch (error) {
    logger.error(error)
    throw new Error('Failed to get real URL for TikTok')
  }
}
