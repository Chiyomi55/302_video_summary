'use server'
import { logger } from '@/lib/logger';
import { produce } from 'immer';
import ky from 'ky';
import { env } from 'next-runtime-env';
import { getAwemeId } from './douyin/aweme-id';
interface VideoResponse {
  code: number;
  data: {
    aweme_details: Array<{
      activity_video_type: number;
      anchors: null;
      authentication_token: string;
      author: {
        accept_private_policy: boolean;
        account_cert_info: string;
        account_region: string;
        ad_cover_url: null;
        apple_account: number;
        authority_status: number;
        avatar_168x168: ImageInfo;
        avatar_300x300: ImageInfo;
        avatar_larger: ImageInfo;
        avatar_medium: ImageInfo;
        avatar_thumb: ImageInfo;
        avatar_uri: string;
        aweme_control: ControlInfo;
        aweme_count: number;
        aweme_hotsoon_auth: number;
        awemehts_greet_info: string;
        ban_user_functions: any[];
        can_set_geofencing: null;
        card_entries: null;
        card_entries_not_display: null;
        card_sort_priority: null;
        cf_list: null;
        cha_list: null;
        close_friend_type: number;
        comment_filter_status: number;
        comment_setting: number;
        commerce_user_level: number;
        constellation: number;
        contacts_status: number;
        contrail_list: null;
        cover_url: ImageInfo[];
        create_time: number;
        custom_verify: string;
        cv_level: string;
        data_label_list: null;
        display_info: null;
        download_prompt_ts: number;
        download_setting: number;
        duet_setting: number;
        enable_nearby_visible: boolean;
        endorsement_info_list: null;
        enterprise_verify_reason: string;
        favoriting_count: number;
        fb_expire_time: number;
        follow_status: number;
        follower_count: number;
        follower_list_secondary_information_struct: null;
        follower_request_status: number;
        follower_status: number;
        followers_detail: null;
        following_count: number;
        geofencing: any[];
        google_account: string;
        has_email: boolean;
        has_facebook_token: boolean;
        has_insights: boolean;
        has_orders: boolean;
        has_twitter_token: boolean;
        has_unread_story: boolean;
        has_youtube_token: boolean;
        hide_location: boolean;
        hide_search: boolean;
        homepage_bottom_toast: null;
        im_role_ids: null;
        ins_id: string;
        interest_tags: null;
        is_ad_fake: boolean;
        is_binded_weibo: boolean;
        is_block: boolean;
        is_blocked_v2: boolean;
        is_blocking_v2: boolean;
        is_cf: number;
        is_discipline_member: boolean;
        is_gov_media_vip: boolean;
        is_mix_user: boolean;
        is_not_show: boolean;
        is_phone_binded: boolean;
        is_star: boolean;
        is_verified: boolean;
        item_list: null;
        ky_only_predict: number;
        language: string;
        link_item_list: null;
        live_agreement: number;
        live_agreement_time: number;
        live_commerce: boolean;
        live_high_value: number;
        live_status: number;
        live_verify: number;
        location: string;
        max_follower_count: number;
        need_points: null;
        need_recommend: number;
        neiguang_shield: number;
        new_friend_type: number;
        new_story_cover: null;
        nickname: string;
        offline_info_list: null;
        personal_tag_list: null;
        platform_sync_info: null;
        prevent_download: boolean;
        react_setting: number;
        reflow_page_gid: number;
        reflow_page_uid: number;
        region: string;
        relative_users: null;
        risk_notice_text: string;
        room_id: number;
        school_category: number;
        school_id: string;
        school_name: string;
        school_poi_id: string;
        school_type: number;
        search_impr: {
          entity_id: string;
        };
        sec_uid: string;
        secret: number;
        share_info: ShareInfo;
        share_qrcode_uri: string;
        shield_comment_notice: number;
        shield_digg_notice: number;
        shield_follow_notice: number;
        short_id: string;
        show_image_bubble: boolean;
        show_nearby_active: boolean;
        signature: string;
        signature_display_lines: number;
        signature_extra: null;
        special_follow_status: number;
        special_lock: number;
        special_people_labels: null;
        status: number;
        stitch_setting: number;
        story_count: number;
        story_open: boolean;
        sync_to_toutiao: number;
        text_extra: null;
        total_favorited: number;
        tw_expire_time: number;
        twitter_id: string;
        twitter_name: string;
        type_label: null;
        uid: string;
        unique_id: string;
        unique_id_modify_time: number;
        user_canceled: boolean;
        user_mode: number;
        user_not_see: number;
        user_not_show: number;
        user_period: number;
        user_permissions: null;
        user_rate: number;
        user_tags: null;
        verification_type: number;
        verify_info: string;
        video_icon: ImageInfo;
        weibo_name: string;
        weibo_schema: string;
        weibo_url: string;
        weibo_verify: string;
        white_cover_url: null;
        with_commerce_entry: boolean;
        with_dou_entry: boolean;
        with_fusion_shop_entry: boolean;
        with_shop_entry: boolean;
        youtube_channel_id: string;
        youtube_channel_title: string;
        youtube_expire_time: number;
      };
      author_mask_tag: number;
      author_user_id: number;
      aweme_control: ControlInfo;
      aweme_id: string;
      aweme_type: number;
      aweme_type_tags: string;
      bodydance_score: number;
      boost_status: number;
      can_cache_to_local: boolean;
      caption: string;
      cf_recheck_ts: number;
      cha_list: Array<{
        author: any;
        banner_list: null;
        cha_attrs: null;
        cha_name: string;
        cid: string;
        collect_stat: number;
        connect_music: any[];
        desc: string;
        extra_attr: {
          is_live: boolean;
        };
        hashtag_profile: string;
        is_challenge: number;
        is_commerce: boolean;
        is_pgcshow: boolean;
        schema: string;
        search_impr: {
          entity_id: string;
        };
        share_info: ShareInfo;
        show_items: null;
        sub_type: number;
        type: number;
        user_count: number;
        view_count: number;
      }>;
      challenge_position: null;
      chapter_list: null;
      city: string;
      cmt_swt: boolean;
      collect_stat: number;
      collection_corner_mark: number;
      comment_gid: number;
      comment_list: null;
      comment_permission_info: {
        can_comment: boolean;
        comment_permission_status: number;
        item_detail_entry: boolean;
        press_entry: boolean;
        toast_guide: boolean;
      };
      commerce_config_data: null;
      commerce_info: {
        ad_type: number;
        is_ad: boolean;
      };
      component_info_v2: string;
      cover_labels: null;
      create_scale_type: string[];
      create_time: number;
      danmaku_control: {
        danmaku_cnt: number;
        enable_danmaku: boolean;
        is_post_denied: boolean;
        pass_through_params: string;
        post_denied_reason: string;
        post_privilege_level: number;
        skip_danmaku: boolean;
      };
      desc: string;
      desc_language: string;
      disable_relation_bar: number;
      dislike_dimension_list: null;
      dislike_dimension_list_v2: null;
      distance: string;
      distribute_circle: {
        campus_block_interaction: boolean;
        distribute_type: number;
        is_campus: boolean;
      };
      distribute_type: number;
      duet_aggregate_in_music_tab: boolean;
      duration: number;
      ecom_comment_atmosphere_type: number;
      enable_comment_sticker_rec: boolean;
      entertainment_product_info: {
        market_info: {
          limit_free: {
            in_free: boolean;
          };
        };
      };
      fall_card_struct: {
        recommend_reason_v2: string;
      };
      feed_comment_config: any;
      flash_mob_trends: number;
      friend_interaction: number;
      friend_recommend_info: any;
      game_tag_info: {
        is_game: boolean;
      };
      geofencing: any[];
      geofencing_regions: null;
      group_id: string;
      guide_btn_type: number;
      guide_scene_info: any;
      has_vs_entry: boolean;
      have_dashboard: boolean;
      horizontal_type: number;
      hybrid_label: null;
      image_album_music_info: {
        begin_time: number;
        end_time: number;
        volume: number;
      };
      image_comment: any;
      image_crop_ctrl: number;
      image_infos: null;
      image_list: null;
      images: null;
      img_bitrate: null;
      impression_data: {
        group_id_list_a: string[];
        group_id_list_b: any[];
        group_id_list_c: string[];
        similar_id_list_a: null;
        similar_id_list_b: null;
      };
      incentive_item_type: number;
      interaction_stickers: null;
      is_24_story: number;
      is_ads: boolean;
      is_collects_selected: number;
      is_duet_sing: boolean;
      is_fantasy: boolean;
      is_first_video: boolean;
      is_hash_tag: number;
      is_image_beat: boolean;
      is_in_scope: boolean;
      is_karaoke: boolean;
      is_life_item: boolean;
      is_pgcshow: boolean;
      is_preview: number;
      is_relieve: boolean;
      is_share_post: boolean;
      is_story: number;
      is_top: number;
      is_use_music: boolean;
      is_vr: boolean;
      item_comment_settings: number;
      item_duet: number;
      item_react: number;
      item_share: number;
      item_stitch: number;
      item_title: string;
      item_warn_notification: {
        content: string;
        show: boolean;
        type: number;
      };
      label_top_text: null;
      libfinsert_task_id: string;
      long_video: null;
      mark_largely_following: boolean;
      media_type: number;
      misc_info: string;
      mix_info: {
        cover_url: ImageInfo;
        create_time: number;
        desc: string;
        enable_ad: number;
        extra: string;
        ids: null;
        is_iaa: number;
        is_serial_mix: number;
        mix_id: string;
        mix_name: string;
        mix_pic_type: number;
        mix_type: number;
        share_info: ShareInfo;
        statis: {
          collect_vv: number;
          current_episode: number;
          play_vv: number;
          updated_to_episode: number;
        };
        status: {
          is_collected: number;
          status: number;
        };
        update_time: number;
        watched_item: string;
      };
      music: {
        album: string;
        artist_user_infos: null;
        artists: any[];
        audition_duration: number;
        author: string;
        author_deleted: boolean;
        author_position: null;
        author_status: number;
        avatar_large: ImageInfo;
        avatar_medium: ImageInfo;
        avatar_thumb: ImageInfo;
        binded_challenge_id: number;
        can_background_play: boolean;
        collect_stat: number;
        cover_hd: ImageInfo;
        cover_large: ImageInfo;
        cover_medium: ImageInfo;
        cover_thumb: ImageInfo;
        dmv_auto_show: boolean;
        dsp_status: number;
        duration: number;
        end_time: number;
        external_song_info: any[];
        extra: string;
        id: number;
        id_str: string;
        is_audio_url_with_cookie: boolean;
        is_commerce_music: boolean;
        is_del_video: boolean;
        is_matched_metadata: boolean;
        is_original: boolean;
        is_original_sound: boolean;
        is_pgc: boolean;
        is_restricted: boolean;
        is_video_self_see: boolean;
        lyric_short_position: null;
        mid: string;
        music_chart_ranks: null;
        music_collect_count: number;
        music_cover_atmosphere_color_value: string;
        music_status: number;
        musician_user_infos: null;
        mute_share: boolean;
        offline_desc: string;
        owner_handle: string;
        owner_id: string;
        owner_nickname: string;
        pgc_music_type: number;
        play_url: {
          height: number;
          uri: string;
          url_key: string;
          url_list: string[];
          width: number;
        };
        position: null;
        prevent_download: boolean;
        prevent_item_download_status: number;
        preview_end_time: number;
        preview_start_time: number;
        reason_type: number;
        redirect: boolean;
        schema_url: string;
        search_impr: {
          entity_id: string;
        };
        sec_uid: string;
        shoot_duration: number;
        source_platform: number;
        start_time: number;
        status: number;
        tag_list: null;
        title: string;
        unshelve_countries: null;
        user_count: number;
        video_duration: number;
      };
      nearby_level: number;
      need_vs_entry: boolean;
      nickname_position: null;
      origin_comment_ids: null;
      origin_duet_resource_uri: string;
      origin_text_extra: any[];
      original: number;
      original_images: null;
      packed_clips: null;
      personal_page_botton_diagnose_style: number;
      photo_search_entrance: {
        ecom_type: number;
      };
      play_progress: {
        last_modified_time: number;
        play_progress: number;
      };
      poi_biz: any;
      poi_patch_info: {
        extra: string;
        item_patch_poi_prompt_mark: number;
      };
      position: null;
      prevent_download: boolean; preview_title: string;
      preview_video_status: number;
      promotions: any[];
      publish_plus_alienation: {
        alienation_type: number;
      };
      rate: number;
      region: string;
      relation_labels: null;
      report_action: boolean;
      risk_infos: {
        content: string;
        risk_sink: boolean;
        type: number;
        vote: boolean;
        warn: boolean;
      };
      seo_info: {
        ocr_content: string;
      };
      series_paid_info: {
        item_price: number;
        series_paid_status: number;
      };
      share_info: ShareInfo;
      share_rec_extra: string;
      share_url: string;
      should_open_ad_report: boolean;
      show_follow_button: any;
      social_tag_list: null;
      sort_label: string;
      statistics: {
        admire_count: number;
        aweme_id: string;
        collect_count: number;
        comment_count: number;
        digest: string;
        digg_count: number;
        download_count: number;
        exposure_count: number;
        forward_count: number;
        live_watch_count: number;
        lose_comment_count: number;
        lose_count: number;
        play_count: number;
        share_count: number;
        whatsapp_share_count: number;
      };
      status: {
        allow_comment: boolean;
        allow_share: boolean;
        aweme_edit_info: {
          button_status: number;
          button_toast: string;
          edit_status: number;
          has_modified_all: boolean;
        };
        aweme_id: string;
        dont_share_status: number;
        download_status: number;
        in_reviewing: boolean;
        is_delete: boolean;
        is_private: boolean;
        is_prohibited: boolean;
        listen_video_status: number;
        part_see: number;
        private_status: number;
        review_result: {
          review_status: number;
        };
        reviewed: number;
        self_see: boolean;
        video_hide_search: number;
        with_fusion_goods: boolean;
        with_goods: boolean;
      };
      story_ttl: number;
      suggest_words: {
        suggest_words: Array<{
          hint_text: string;
          icon_url: string;
          scene: string;
          words: Array<{
            info: string;
            word: string;
            word_id: string;
          }>;
        }>;
      };
      text_extra: Array<{
        caption_end: number;
        caption_start: number;
        end: number;
        hashtag_id: string;
        hashtag_name: string;
        is_commerce: boolean;
        start: number;
        type: number;
      }>;
      uniqid_position: null;
      user_digged: number;
      user_recommend_status: number;
      video: {
        animated_cover: ImageInfo;
        audio: any;
        big_thumbs: Array<{
          duration: number;
          fext: string;
          img_num: number;
          img_url: string;
          img_urls: string[];
          img_x_len: number;
          img_x_size: number;
          img_y_len: number;
          img_y_size: number;
          interval: number;
          uri: string;
          uris: string[];
        }>;
        bit_rate: Array<{
          FPS: number;
          HDR_bit: string;
          HDR_type: string;
          bit_rate: number;
          format: string;
          gear_name: string;
          is_bytevc1: number;
          is_h265: number;
          play_addr: {
            data_size: number;
            file_cs: string;
            file_hash: string;
            height: number;
            uri: string;
            url_key: string;
            url_list: string[];
            width: number;
          };
          quality_type: number;
          video_extra: string;
        }>;
        bit_rate_audio: Array<{
          audio_extra: string;
          audio_meta: {
            bitrate: number;
            codec_type: string;
            encoded_type: string;
            file_hash: string;
            file_id: string;
            format: string;
            fps: number;
            logo_type: string;
            media_type: string;
            quality: string;
            quality_desc: string;
            size: number;
            sub_info: string;
            url_list: {
              backup_url: string;
              fallback_url: string;
              main_url: string;
            };
          };
          audio_quality: number;
        }>;
        cdn_url_expired: number;
        cover: ImageInfo;
        cover_original_scale: ImageInfo;
        download_addr: {
          data_size: number;
          file_cs: string;
          height: number;
          uri: string;
          url_list: string[];
          width: number;
        };
        duration: number;
        dynamic_cover: ImageInfo;
        format: string;
        gaussian_cover: ImageInfo;
        has_watermark: boolean;
        height: number;
        horizontal_type: number;
        is_bytevc1: number;
        is_callback: boolean;
        is_h265: number;
        is_long_video: number;
        is_source_HDR: number;
        meta: string;
        need_set_token: boolean;
        origin_cover: ImageInfo;
        play_addr: {
          data_size: number;
          file_cs: string;
          file_hash: string;
          height: number;
          uri: string;
          url_key: string;
          url_list: string[];
          width: number;
        };
        play_addr_265: {
          data_size: number;
          file_cs: string;
          file_hash: string;
          height: number;
          uri: string;
          url_key: string;
          url_list: string[];
          width: number;
        };
        play_addr_h264: {
          data_size: number;
          file_cs: string;
          file_hash: string;
          height: number;
          uri: string;
          url_key: string;
          url_list: string[];
          width: number;
        };
        ratio: string;
        tags: null;
        video_model: string;
        width: number;
      };
      video_control: {
        allow_douplus: boolean;
        allow_download: boolean;
        allow_duet: boolean;
        allow_dynamic_wallpaper: boolean;
        allow_music: boolean;
        allow_react: boolean;
        allow_record: boolean;
        allow_share: boolean;
        allow_stitch: boolean;
        disable_record_reason: string;
        download_ignore_visibility: boolean;
        download_info: {
          fail_info: {
            code: number;
            msg: string;
            reason: string;
          };
          level: number;
        };
        draft_progress_bar: number;
        duet_ignore_visibility: boolean;
        duet_info: {
          fail_info: {
            code: number;
            reason: string;
          };
          level: number;
        };
        prevent_download_type: number;
        share_grayed: boolean;
        share_ignore_visibility: boolean;
        share_type: number;
        show_progress_bar: number;
        timer_info: any;
        timer_status: number;
      };
      video_game_data_channel_config: any;
      video_labels: null;
      video_share_edit_status: number;
      video_tag: Array<{
        level: number;
        tag_id: number;
        tag_name: string;
      }>;
      video_text: any[];
      visual_search_info: {
        is_ecom_img: boolean;
        is_show_img_entrance: boolean;
      };
      vr_type: number;
      with_promotional_music: boolean;
      without_watermark: boolean;
      xigua_base_info: {
        item_id: number;
        star_altar_order_id: number;
        star_altar_type: number;
        status: number;
      };
      xigua_task: {
        is_xigua_task: boolean;
      };
    }>;
    emoji_list: null;
    extra: {
      fatal_item_ids: any[];
      logid: string;
      now: number;
    };
    filter_list: null;
    log_pb: {
      impr_id: string;
    };
    status_code: number;
    verification_filter_list: null;
  };
  params: {
    aweme_id: string;
  };
  router: string;
}

interface ImageInfo {
  height: number;
  uri: string;
  url_list: string[];
  width: number;
}

interface ControlInfo {
  can_comment: boolean;
  can_forward: boolean;
  can_share: boolean;
  can_show_comment: boolean;
}

interface ShareInfo {
  share_desc: string;
  share_desc_info: string;
  share_title: string;
  share_title_myself: string;
  share_title_other: string;
  share_url: string;
  share_weibo_desc: string;
}

export const getRealUrlForDouyin = async (id: string, apiKey: string) => {
  try {
    const API_URL = env('NEXT_PUBLIC_API_URL')!

    const awemeId = await getAwemeId(id, apiKey)
    if (!awemeId) {
      return null
    }

    const response = await ky
      .get(`${API_URL}/tools/douyin/web/fetch_one_video_v2`, {
        searchParams: {
          aweme_id: awemeId,
        },
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 10000,
      })
      .json<VideoResponse>()

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
    throw new Error('Failed to get real URL for Douyin')
  }
}
